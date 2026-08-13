document.addEventListener('DOMContentLoaded', () => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    
    let currentStep = 1;
    const totalSteps = 4;
    const stepBadges = ['Yemek Kalitesi', 'Servis Kalitesi', 'Mekan & Hijyen', 'Genel Değerlendirme'];

    initAppRouter();
    initStarRatingGroups();
    initSurveyWizard();
    initAdminLogin();
    initAdminDashboard();
    initDemoTrigger();

    function initAppRouter() {
        const path = window.location.pathname;
        const hash = window.location.hash;
        
        const customerApp = document.getElementById('customerApp');
        const adminLoginApp = document.getElementById('adminLoginApp');
        const adminDashboardApp = document.getElementById('adminDashboardApp');

        if (path === '/login' || hash === '#login') {
            customerApp.style.display = 'none';
            adminDashboardApp.style.display = 'none';
            adminLoginApp.style.display = 'block';
        } else if (path === '/admin' || hash === '#admin') {
            const token = sessionStorage.getItem('admin_token');
            if (token) {
                customerApp.style.display = 'none';
                adminLoginApp.style.display = 'none';
                adminDashboardApp.style.display = 'block';
                loadAdminReviews();
                loadMonthlyEvaluation();
            } else {
                customerApp.style.display = 'none';
                adminDashboardApp.style.display = 'none';
                adminLoginApp.style.display = 'block';
            }
        } else {
            customerApp.style.display = 'block';
            adminLoginApp.style.display = 'none';
            adminDashboardApp.style.display = 'none';
        }
    }

    function initStarRatingGroups() {
        document.querySelectorAll('.star-rating-group').forEach(group => {
            const targetId = group.getAttribute('data-target');
            const hiddenInput = document.getElementById(targetId);
            const stars = group.querySelectorAll('.star-btn');

            stars.forEach(star => {
                star.addEventListener('click', function() {
                    const val = parseInt(this.getAttribute('data-val'));
                    hiddenInput.value = val;
                    stars.forEach(s => {
                        const sVal = parseInt(s.getAttribute('data-val'));
                        if (sVal <= val) {
                            s.classList.add('active');
                        } else {
                            s.classList.remove('active');
                        }
                    });
                });
            });
        });
    }

    function initSurveyWizard() {
        const btnPrev = document.getElementById('btnPrevStep');
        const btnNext = document.getElementById('btnNextStep');
        const btnSubmit = document.getElementById('btnSubmitSurvey');
        const btnReset = document.getElementById('btnResetSurvey');

        if (btnNext) {
            btnNext.addEventListener('click', () => {
                const currentStars = getStepStarValue(currentStep);
                if (currentStars === 0) {
                    showToast('Lütfen devam etmeden önce yıldız puanı seçin.', 'error');
                    return;
                }
                if (currentStep < totalSteps) {
                    currentStep++;
                    updateSurveyStepUI();
                }
            });
        }

        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                if (currentStep > 1) {
                    currentStep--;
                    updateSurveyStepUI();
                }
            });
        }

        if (btnSubmit) {
            btnSubmit.addEventListener('click', async () => {
                const overallStars = parseInt(document.getElementById('overallStars')?.value || '0');
                if (overallStars === 0) {
                    showToast('Lütfen genel memnuniyet puanınızı yıldızlarla belirtin.', 'error');
                    return;
                }

                const payload = {
                    waiter_id: document.getElementById('surveyWaiterId')?.value || 1,
                    bill_id: document.getElementById('surveyBillId')?.value || null,
                    order_id: document.getElementById('surveyOrderId')?.value || null,
                    table_no: document.getElementById('surveyTableNo')?.value || null,
                    food_stars: parseInt(document.getElementById('foodStars')?.value || '0') || null,
                    food_comment: document.getElementById('foodComment')?.value.trim() || null,
                    service_stars: parseInt(document.getElementById('serviceStars')?.value || '0') || null,
                    service_comment: document.getElementById('serviceComment')?.value.trim() || null,
                    atmosphere_stars: parseInt(document.getElementById('atmosphereStars')?.value || '0') || null,
                    atmosphere_comment: document.getElementById('atmosphereComment')?.value.trim() || null,
                    overall_stars: overallStars,
                    comment: document.getElementById('overallComment')?.value.trim() || null,
                    customer_name: document.getElementById('customerName')?.value.trim() || 'Misafir'
                };

                btnSubmit.disabled = true;
                btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Kaydediliyor...';

                try {
                    const res = await fetch('/api/review', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': csrfToken,
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });

                    if (res.ok) {
                        document.getElementById('surveyForm').style.display = 'none';
                        document.getElementById('surveySuccess').style.display = 'block';
                        showToast('Değerlendirmeniz başarıyla kaydedildi!', 'success');
                        refreshPublicReviews();
                    } else {
                        showToast('Değerlendirme kaydedilirken bir hata oluştu.', 'error');
                        btnSubmit.disabled = false;
                        btnSubmit.innerHTML = '<i class="fas fa-paper-plane"></i> Değerlendirmeyi Tamamla';
                    }
                } catch (e) {
                    showToast('Bağlantı hatası oluştu.', 'error');
                    btnSubmit.disabled = false;
                    btnSubmit.innerHTML = '<i class="fas fa-paper-plane"></i> Değerlendirmeyi Tamamla';
                }
            });
        }

        if (btnReset) {
            btnReset.addEventListener('click', () => {
                resetSurveyForm();
            });
        }
    }

    function getStepStarValue(step) {
        if (step === 1) return parseInt(document.getElementById('foodStars')?.value || '0');
        if (step === 2) return parseInt(document.getElementById('serviceStars')?.value || '0');
        if (step === 3) return parseInt(document.getElementById('atmosphereStars')?.value || '0');
        if (step === 4) return parseInt(document.getElementById('overallStars')?.value || '0');
        return 0;
    }

    function updateSurveyStepUI() {
        document.querySelectorAll('.survey-step').forEach(el => {
            const stepNum = parseInt(el.getAttribute('data-step'));
            if (stepNum === currentStep) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });

        const progressFill = document.getElementById('surveyProgressFill');
        if (progressFill) {
            progressFill.style.width = `${(currentStep / totalSteps) * 100}%`;
        }

        const stepNumEl = document.getElementById('currentStepNum');
        if (stepNumEl) stepNumEl.textContent = currentStep;

        const badgeEl = document.getElementById('stepTitleBadge');
        if (badgeEl) badgeEl.textContent = stepBadges[currentStep - 1];

        const btnPrev = document.getElementById('btnPrevStep');
        const btnNext = document.getElementById('btnNextStep');
        const btnSubmit = document.getElementById('btnSubmitSurvey');

        if (currentStep === 1) {
            btnPrev.style.display = 'none';
            btnNext.style.display = 'inline-flex';
            btnSubmit.style.display = 'none';
        } else if (currentStep === totalSteps) {
            btnPrev.style.display = 'inline-flex';
            btnNext.style.display = 'none';
            btnSubmit.style.display = 'inline-flex';
        } else {
            btnPrev.style.display = 'inline-flex';
            btnNext.style.display = 'inline-flex';
            btnSubmit.style.display = 'none';
        }
    }

    function resetSurveyForm() {
        currentStep = 1;
        document.querySelectorAll('input[type="hidden"]').forEach(el => {
            if (el.id.endsWith('Stars')) el.value = '0';
        });
        document.querySelectorAll('.star-btn').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.form-input').forEach(i => i.value = '');
        
        document.getElementById('surveyForm').style.display = 'block';
        document.getElementById('surveySuccess').style.display = 'none';
        
        const btnSubmit = document.getElementById('btnSubmitSurvey');
        if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = '<i class="fas fa-paper-plane"></i> Değerlendirmeyi Tamamla';
        }

        updateSurveyStepUI();
    }

    function initDemoTrigger() {
        const btn = document.getElementById('btnSimulateDesktopBill');
        if (btn) {
            btn.addEventListener('click', () => {
                const sampleOrders = ['SIP-1004', 'SIP-1005', 'SIP-1006', 'SIP-1007'];
                const randomOrderId = sampleOrders[Math.floor(Math.random() * sampleOrders.length)];
                window.closeBillExternal({
                    order_id: randomOrderId,
                    table_no: Math.floor(Math.random() * 15) + 1,
                    waiter_id: Math.floor(Math.random() * 3) + 1,
                    items: [
                        { name: 'Kuzu Pirzola', price: 420, quantity: 2 },
                        { name: 'Meze Tabağı', price: 180, quantity: 1 },
                        { name: 'Türk Kahvesi', price: 50, quantity: 2 }
                    ],
                    total: 1120
                });
            });
        }
    }

    window.closeBillExternal = async function(data) {
        try {
            const response = await fetch('/api/bill/close', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify(data)
            });

            const bill = await response.json();
            renderBillCard(bill);

            document.getElementById('surveyBillId').value = bill.id || '';
            document.getElementById('surveyOrderId').value = bill.order_id || data.order_id || '';
            document.getElementById('surveyTableNo').value = bill.table_no || data.table_no || '';
            document.getElementById('surveyWaiterId').value = bill.waiter_id || data.waiter_id || 1;

            resetSurveyForm();
            
            const surveySection = document.getElementById('surveySection');
            if (surveySection) {
                surveySection.style.display = 'block';
                surveySection.scrollIntoView({ behavior: 'smooth' });
            }

            showToast(`Sipariş #${bill.order_id || data.order_id} hesabı kapatıldı. Ankete yönlendiriliyorsunuz.`, 'success');
        } catch (e) {
            showToast('Adisyon oluşturulurken hata oluştu.', 'error');
        }
    };

    function renderBillCard(bill) {
        const section = document.getElementById('billSection');
        if (!section) return;

        const waiterName = bill.waiter ? bill.waiter.name : 'Garson';
        const banner = document.getElementById('waiterBanner');
        if (banner) {
            banner.innerHTML = `
                <div class="waiter-avatar"><i class="fas fa-user-tie"></i></div>
                <div class="waiter-meta">
                    <h4>${waiterName}</h4>
                    <p>Sipariş No: <strong>${bill.order_id || '-'}</strong> · Masa ${bill.table_no || '-'}</p>
                </div>
            `;
        }

        const itemsTable = document.getElementById('billItems');
        if (itemsTable && bill.items) {
            let rows = `<thead><tr><th>Ürün</th><th>Adet</th><th style="text-align:right">Fiyat</th><th style="text-align:right">Toplam</th></tr></thead><tbody>`;
            bill.items.forEach(item => {
                const lineTotal = (item.price || 0) * (item.quantity || 1);
                rows += `<tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td style="text-align:right">${formatTRY(item.price)}</td>
                    <td style="text-align:right">${formatTRY(lineTotal)}</td>
                </tr>`;
            });
            rows += `</tbody>`;
            itemsTable.innerHTML = rows;
        }

        const summary = document.getElementById('billSummary');
        if (summary) {
            summary.innerHTML = `<span>Hesap Tutarı</span><span>${formatTRY(bill.total)}</span>`;
        }

        section.style.display = 'block';
    }

    function initAdminLogin() {
        const form = document.getElementById('adminLoginForm');
        const errorMsg = document.getElementById('loginErrorMsg');

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const u = document.getElementById('adminUsername').value.trim();
                const p = document.getElementById('adminPassword').value.trim();

                try {
                    const res = await fetch('/api/admin/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': csrfToken
                        },
                        body: JSON.stringify({ username: u, password: p })
                    });

                    const data = await res.json();
                    if (res.ok && data.success) {
                        sessionStorage.setItem('admin_token', data.token);
                        document.getElementById('adminLoginApp').style.display = 'none';
                        document.getElementById('adminDashboardApp').style.display = 'block';
                        window.location.hash = '#admin';
                        loadAdminReviews();
                        loadMonthlyEvaluation();
                    } else {
                        errorMsg.textContent = data.message || 'Giriş başarısız.';
                        errorMsg.style.display = 'block';
                    }
                } catch (err) {
                    errorMsg.textContent = 'Sunucuya bağlanılamadı.';
                    errorMsg.style.display = 'block';
                }
            });
        }

        const btnLogout = document.getElementById('btnAdminLogout');
        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                sessionStorage.removeItem('admin_token');
                window.location.href = '/';
            });
        }
    }

    function initAdminDashboard() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

                this.classList.add('active');
                const targetTab = this.getAttribute('data-tab');
                document.getElementById(targetTab)?.classList.add('active');
            });
        });

        const btnApply = document.getElementById('btnApplyFilters');
        if (btnApply) {
            btnApply.addEventListener('click', () => {
                loadAdminReviews();
            });
        }

        const btnReset = document.getElementById('btnResetFilters');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                document.getElementById('filterOrderId').value = '';
                document.getElementById('filterWaiterId').value = '';
                document.getElementById('filterTableNo').value = '';
                document.getElementById('filterStars').value = '';
                loadAdminReviews();
            });
        }

        const btnEval = document.getElementById('btnLoadMonthlyEval');
        if (btnEval) {
            btnEval.addEventListener('click', () => {
                loadMonthlyEvaluation();
            });
        }
    }

    async function loadAdminReviews() {
        const tbody = document.getElementById('adminReviewsTbody');
        if (!tbody) return;

        const orderId = document.getElementById('filterOrderId')?.value.trim() || '';
        const waiterId = document.getElementById('filterWaiterId')?.value || '';
        const tableNo = document.getElementById('filterTableNo')?.value || '';
        const stars = document.getElementById('filterStars')?.value || '';

        const params = new URLSearchParams();
        if (orderId) params.append('order_id', orderId);
        if (waiterId) params.append('waiter_id', waiterId);
        if (tableNo) params.append('table_no', tableNo);
        if (stars) params.append('stars', stars);

        tbody.innerHTML = `<tr><td colspan="10" class="text-center">Sorgulanıyor...</td></tr>`;

        try {
            const res = await fetch(`/api/reviews?${params.toString()}`);
            if (res.ok) {
                const reviews = await res.json();
                renderAdminReviewsTable(reviews);
            }
        } catch (e) {
            tbody.innerHTML = `<tr><td colspan="10" class="text-center">Yorumlar yüklenirken hata oluştu.</td></tr>`;
        }
    }

    function renderAdminReviewsTable(reviews) {
        const tbody = document.getElementById('adminReviewsTbody');
        if (!tbody) return;

        if (reviews.length === 0) {
            tbody.innerHTML = `<tr><td colspan="10" class="text-center">Kritere uygun kayıt bulunamadı.</td></tr>`;
            return;
        }

        let html = '';
        reviews.forEach(r => {
            html += `<tr>
                <td><strong>${r.order_id || r.bill?.order_id || '-'}</strong></td>
                <td>Masa ${r.table_no || r.bill?.table_no || '-'}</td>
                <td>${r.waiter ? r.waiter.name : '-'}</td>
                <td>${r.food_stars ? renderStarsMini(r.food_stars) : '-'}</td>
                <td>${r.service_stars ? renderStarsMini(r.service_stars) : '-'}</td>
                <td>${r.atmosphere_stars ? renderStarsMini(r.atmosphere_stars) : '-'}</td>
                <td><strong style="color:var(--gold)">${renderStarsMini(r.overall_stars)}</strong></td>
                <td>${r.comment || r.food_comment || r.service_comment || '-'}</td>
                <td>${r.customer_name || 'Misafir'}</td>
                <td>${formatDate(r.created_at)}</td>
            </tr>`;
        });

        tbody.innerHTML = html;
    }

    async function loadMonthlyEvaluation() {
        const grid = document.getElementById('leaderboardGrid');
        if (!grid) return;

        const m = document.getElementById('evalMonth')?.value || 8;
        const y = document.getElementById('evalYear')?.value || 2026;

        grid.innerHTML = `<p class="empty-msg">Performans verileri hesaplanıyor...</p>`;

        try {
            const res = await fetch(`/api/admin/monthly-evaluation?month=${m}&year=${y}`);
            if (res.ok) {
                const data = await res.json();
                renderLeaderboard(data.waiters);
            }
        } catch (e) {
            grid.innerHTML = `<p class="empty-msg">Ay sonu verisi yüklenemedi.</p>`;
        }
    }

    function renderLeaderboard(waiters) {
        const grid = document.getElementById('leaderboardGrid');
        if (!grid) return;

        if (waiters.length === 0) {
            grid.innerHTML = `<p class="empty-msg">Bu ay için değerlendirme verisi bulunmuyor.</p>`;
            return;
        }

        const medals = ['🥇', '🥈', '🥉'];
        let html = '';

        waiters.forEach((w, index) => {
            const medal = medals[index] || `#${index + 1}`;

            html += `
            <div class="waiter-scorecard ${index === 0 ? 'rank-1' : ''}">
                <div class="rank-badge">${medal}</div>
                <div class="scorecard-header">
                    <div class="scorecard-avatar-icon"><i class="fas fa-user-tie"></i></div>
                    <div class="scorecard-name">
                        <h3>${w.name}</h3>
                        <span>Garson ID: ${w.waiter_id} · ${w.total_reviews} Değerlendirme</span>
                    </div>
                </div>
                <div class="score-main">
                    <div class="score-num">${w.monthly_score} <small>/100</small></div>
                    <div class="score-label">Ay Sonu Performans Skoru</div>
                </div>
                <div class="score-breakdown">
                    <div class="breakdown-box">
                        <div class="breakdown-val">${w.avg_food || 0}★</div>
                        <div class="breakdown-lbl">Yemek</div>
                    </div>
                    <div class="breakdown-box">
                        <div class="breakdown-val">${w.avg_service || 0}★</div>
                        <div class="breakdown-lbl">Servis</div>
                    </div>
                    <div class="breakdown-box">
                        <div class="breakdown-val">${w.avg_atmosphere || 0}★</div>
                        <div class="breakdown-lbl">Atmosfer</div>
                    </div>
                </div>
            </div>`;
        });

        grid.innerHTML = html;
    }

    async function refreshPublicReviews() {
        const grid = document.getElementById('publicReviewsGrid');
        if (!grid) return;
        try {
            const res = await fetch('/api/reviews');
            if (res.ok) {
                const reviews = await res.json();
                let html = '';
                reviews.slice(0, 6).forEach(r => {
                    html += `
                    <div class="review-tile">
                        <div class="tile-header">
                            <div class="tile-user"><i class="fas fa-user-circle"></i> <span>${r.customer_name || 'Misafir'}</span></div>
                            <div class="tile-time">Az önce</div>
                        </div>
                        <div class="tile-stars">${renderStarsMini(r.overall_stars)}</div>
                        ${r.waiter ? `<div class="tile-waiter">Garson: <strong>${r.waiter.name}</strong></div>` : ''}
                        ${r.comment ? `<div class="tile-body">${r.comment}</div>` : ''}
                    </div>`;
                });
                grid.innerHTML = html;
            }
        } catch (e) {}
    }

    function renderStarsMini(val) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= val) {
                stars += '<i class="fas fa-star"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    function formatTRY(amount) {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount || 0);
    }

    function formatDate(dateStr) {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        const icon = type === 'success' ? '<i class="fas fa-check-circle" style="color:var(--success)"></i>' : '<i class="fas fa-exclamation-circle" style="color:var(--danger)"></i>';
        toast.innerHTML = `${icon} <span>${message}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }
});
