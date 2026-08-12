document.addEventListener('DOMContentLoaded', () => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    
    let selectedRating = 0;
    const stars = document.querySelectorAll('.star');
    const reviewComment = document.getElementById('reviewComment');
    const charCount = document.getElementById('charCount');
    const btnSubmit = document.getElementById('btnSubmit');
    const successMessage = document.getElementById('successMessage');
    const billSection = document.getElementById('billSection');
    const reviewSection = document.getElementById('reviewSection');
    const btnCloseBill = document.getElementById('btnCloseBill');
    const btnPrint = document.getElementById('btnPrint');
    const btnDemo = document.getElementById('btnDemo');
    
    stars.forEach(star => {
        star.addEventListener('mouseenter', function() {
            const val = parseInt(this.getAttribute('data-value'));
            highlightStars(val);
        });
        star.parentElement.addEventListener('mouseleave', function() {
            highlightStars(selectedRating);
        });
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-value'));
            highlightStars(selectedRating);
        });
    });

    function highlightStars(val) {
        stars.forEach(s => {
            const starVal = parseInt(s.getAttribute('data-value'));
            if(starVal <= val) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    }

    if(reviewComment && charCount) {
        reviewComment.addEventListener('input', function() {
            charCount.textContent = `${this.value.length} / 500`;
        });
    }

    if(btnSubmit) {
        btnSubmit.addEventListener('click', async function(e) {
            e.preventDefault();
            if(selectedRating === 0) {
                showNotification('Lütfen bir puan seçin.', 'error');
                return;
            }
            
            const waiterId = document.getElementById('waiterIdInput')?.value || '1';
            let customerName = document.getElementById('customerName')?.value.trim();
            if(!customerName) customerName = 'Misafir';
            const comment = reviewComment.value.trim();
            
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
            this.disabled = true;
            
            try {
                const response = await fetch('/api/review', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        waiter_id: waiterId,
                        stars: selectedRating,
                        comment: comment,
                        customer_name: customerName
                    })
                });
                
                if(!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                successMessage.style.display = 'flex';
                this.style.display = 'none';
                
                setTimeout(() => {
                    loadReviews(waiterId);
                }, 1000);
                
            } catch (error) {
                showNotification('Değerlendirme gönderilirken bir hata oluştu.', 'error');
                this.innerHTML = originalText;
                this.disabled = false;
            }
        });
    }

    if(btnCloseBill) {
        btnCloseBill.addEventListener('click', async function() {
            if(confirm('Hesabı kapatmak istediğinize emin misiniz?')) {
                const billId = document.getElementById('billSection')?.getAttribute('data-bill-id');
                if(billId) {
                    try {
                        await fetch(`/api/bill/${billId}/print`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': csrfToken
                            }
                        });
                    } catch(e) {}
                }
                const badge = document.querySelector('.status-badge');
                if(badge) {
                    badge.className = 'status-badge status-closed';
                    badge.textContent = 'Kapalı';
                }
                
                showNotification('Hesap başarıyla kapatıldı.', 'success');
                
                if(reviewSection) {
                    reviewSection.style.display = 'block';
                    reviewSection.scrollIntoView({ behavior: 'smooth' });
                }
                this.style.display = 'none';
            }
        });
    }

    if(btnPrint) {
        btnPrint.addEventListener('click', () => {
            window.print();
        });
    }

    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', createRipple);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const billId = urlParams.get('bill_id');
    if(billId) {
        loadBill(billId);
    }
    
    document.querySelectorAll('.review-date[data-date]').forEach(el => {
        el.textContent = timeAgo(el.getAttribute('data-date'));
    });

    if(btnDemo) {
        btnDemo.addEventListener('click', window.demoCloseBill);
    }
});

function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');
    const ripple = button.querySelector('.ripple');
    if (ripple) {
        ripple.remove();
    }
    button.appendChild(circle);
}

function showNotification(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? '<i class="fas fa-check-circle" style="color:#81C784"></i>' : '<i class="fas fa-exclamation-circle" style="color:#E57373"></i>';
    toast.innerHTML = `${icon} <span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(30px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function timeAgo(dateString) {
    if(!dateString) return 'Az önce';
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " yıl önce";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " ay önce";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " gün önce";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " saat önce";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " dakika önce";
    return Math.floor(seconds > 0 ? seconds : 0) + " saniye önce";
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
}

async function loadReviews(waiterId) {
    try {
        const response = await fetch(`/api/reviews?waiter_id=${waiterId}`);
        if(response.ok) {
            const data = await response.json();
            renderReviews(data);
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

function renderReviews(reviews) {
    const list = document.getElementById('reviewsList');
    if(!list) return;
    let html = '';
    reviews.forEach((review, index) => {
        let starsHtml = '';
        for(let i=1; i<=5; i++) {
            if(i <= review.stars) {
                starsHtml += '<i class="fas fa-star"></i>';
            } else {
                starsHtml += '<i class="far fa-star"></i>';
            }
        }
        
        html += `
        <div class="review-card" style="animation-delay: ${index * 0.1}s">
            <div class="review-header">
                <div class="reviewer-name"><i class="fas fa-user-circle"></i> ${review.customer_name || 'Misafir'}</div>
                <div class="review-date">${timeAgo(review.created_at)}</div>
            </div>
            <div class="review-stars">${starsHtml}</div>
            ${review.waiter ? `<div class="review-waiter">Garson: ${review.waiter.name}</div>` : ''}
            ${review.comment ? `<div class="review-comment">${review.comment}</div>` : ''}
        </div>`;
    });
    list.innerHTML = html;
}

async function loadBill(billId) {
    try {
        const response = await fetch(`/api/bill/${billId}`);
        if(response.ok) {
            const data = await response.json();
            renderBill({
                id: data.id,
                waiter_id: data.waiter_id,
                waiter_name: data.waiter ? data.waiter.name : 'Garson',
                items: data.items,
                table_no: data.table_no,
                total: data.total,
                status: data.status
            });
        }
    } catch(error) {
        console.error('Error loading bill:', error);
    }
}

function renderBill(data) {
    const billSection = document.getElementById('billSection');
    if(!billSection) return;
    
    document.getElementById('waiterIdInput').value = data.waiter_id;
    if(data.id) billSection.setAttribute('data-bill-id', data.id);
    
    const waiterInfo = document.getElementById('waiterInfo');
    if(waiterInfo) {
        waiterInfo.innerHTML = `
            <div class="waiter-avatar"><i class="fas fa-user-tie"></i></div>
            <div class="waiter-details">
                <h4>${data.waiter_name || 'Garson'}</h4>
                <p>Masa ${data.table_no || '-'} · Masanızla ilgilenen personel</p>
            </div>
            <div style="margin-left: auto;">
                <span class="status-badge ${data.status === 'closed' ? 'status-closed' : 'status-open'}">${data.status === 'closed' ? 'Kapalı' : 'Açık'}</span>
            </div>
        `;
    }
    
    const tbody = document.createElement('tbody');
    let total = 0;
    
    const thead = `
        <thead>
            <tr>
                <th>Ürün</th>
                <th style="text-align: center;">Adet</th>
                <th style="text-align: right;">Fiyat</th>
                <th style="text-align: right;">Toplam</th>
            </tr>
        </thead>
    `;
    
    let rowsHtml = '';
    data.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        rowsHtml += `
            <tr>
                <td>${item.name}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">${formatCurrency(item.price)}</td>
                <td style="text-align: right;">${formatCurrency(itemTotal)}</td>
            </tr>
        `;
    });
    
    const table = document.getElementById('billItems');
    if(table) {
        table.innerHTML = thead + `<tbody>${rowsHtml}</tbody>`;
    }
    
    const totalDiv = document.getElementById('billTotal');
    if(totalDiv) {
        totalDiv.innerHTML = `
            <span>Genel Toplam</span>
            <span>${formatCurrency(total)}</span>
        `;
    }
    
    billSection.style.display = 'block';
    billSection.scrollIntoView({ behavior: 'smooth' });
}

window.closeBillExternal = async function(data) {
    try {
        const response = await fetch('/api/bill/close', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            },
            body: JSON.stringify(data)
        });
        
        const responseData = await response.json();
        renderBill({
            id: responseData.id,
            waiter_id: responseData.waiter_id,
            waiter_name: responseData.waiter ? responseData.waiter.name : 'Garson',
            items: responseData.items,
            table_no: responseData.table_no,
            total: responseData.total,
            status: responseData.status
        });
        
        showNotification(`Masa ${data.table_no} hesabı oluşturuldu.`, 'success');
        
    } catch(error) {
        renderBill({
            waiter_id: data.waiter_id,
            waiter_name: 'Garson',
            items: data.items,
            table_no: data.table_no
        });
        showNotification('Demo hesap yüklendi.', 'success');
    }
};

window.demoCloseBill = function() {
    window.closeBillExternal({
        table_no: 5,
        waiter_id: 1,
        items: [
            {name: 'Adana Kebap', price: 250, quantity: 2},
            {name: 'Ayran', price: 30, quantity: 2},
            {name: 'Künefe', price: 120, quantity: 1},
            {name: 'Çoban Salata', price: 65, quantity: 1}
        ]
    });
};
