document.addEventListener('DOMContentLoaded', () => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    
    let currentStep = 1;
    let totalSteps = 4;
    let loadedQuestions = [];

    initAppRouter();
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
                loadAdminQuestions();
            } else {
                customerApp.style.display = 'none';
                adminDashboardApp.style.display = 'none';
                adminLoginApp.style.display = 'block';
            }
        } else {
            customerApp.style.display = 'block';
            adminLoginApp.style.display = 'none';
            adminDashboardApp.style.display = 'none';
            loadCustomerQuestions();
        }
    }

    async function loadCustomerQuestions() {
        try {
            const res = await fetch('/api/questions?active_only=1');
            if (res.ok) {
                loadedQuestions = await res.json();
                renderCustomerQuestionsUI(loadedQuestions);
            }
        } catch (e) {
            console.error(e);
        }
    }

    function renderCustomerQuestionsUI(questions) {
        const container = document.getElementById('surveyStepsContainer');
        if (!container) return;

        if (!questions || questions.length === 0) {
            questions = [
                { id: 1, step_number: 1, title: 'Yemekler nasıldı?', subtitle: 'Lezzet ve sunum kalitesini puanlayın', category_name: 'Yemek Kalitesi', icon_class: 'fas fa-utensils', key_name: 'food' },
                { id: 2, step_number: 2, title: 'Garson ilgisi ve servis nasıldı?', subtitle: 'Hizmet hızını ve nezaketini puanlayın', category_name: 'Servis Kalitesi', icon_class: 'fas fa-user-tie', key_name: 'service' },
                { id: 3, step_number: 3, title: 'Mekan atmosferi ve temizlik nasıldı?', subtitle: 'Ortamın ambiansı ve temizliğini puanlayın', category_name: 'Mekan & Hijyen', icon_class: 'fas fa-concierge-bell', key_name: 'atmosphere' },
                { id: 4, step_number: 4, title: 'Genel Memnuniyetiniz', subtitle: 'Son değerlendirmenizi yapın', category_name: 'Genel Değerlendirme', icon_class: 'fas fa-award', key_name: 'overall' }
            ];
            loadedQuestions = questions;
        }

        totalSteps = questions.length;
        const totalStepsEl = document.getElementById('totalStepsNum');
        if (totalStepsEl) totalStepsEl.textContent = totalSteps;

        let html = '';
        questions.forEach((q, idx) => {
            const stepNum = idx + 1;
            const targetStarsId = `${q.key_name || 'q_' + q.id}Stars`;
            const commentId = `${q.key_name || 'q_' + q.id}Comment`;
            const isLast = stepNum === totalSteps;

            html += `
            <div class="survey-step ${stepNum === 1 ? 'active' : ''}" data-step="${stepNum}" data-key="${q.key_name || 'custom'}" data-qid="${q.id}">
                <div class="step-icon"><i class="${q.icon_class || 'fas fa-star'}"></i></div>
                <h2 class="step-heading">${q.title}</h2>
                <p class="step-subheading">${q.subtitle || ''}</p>
                <div class="star-rating-group" data-target="${targetStarsId}">
                    <span class="star-btn" data-val="5"><i class="fas fa-star"></i></span>
                    <span class="star-btn" data-val="4"><i class="fas fa-star"></i></span>
                    <span class="star-btn" data-val="3"><i class="fas fa-star"></i></span>
                    <span class="star-btn" data-val="2"><i class="fas fa-star"></i></span>
                    <span class="star-btn" data-val="1"><i class="fas fa-star"></i></span>
                </div>
                <input type="hidden" id="${targetStarsId}" value="0">
                ${isLast ? `
                <div class="form-group margin-top">
                    <input type="text" id="customerName" class="form-input" placeholder="Adınız (isteğe bağlı)" value="">
                </div>
                <div class="form-group">
                    <textarea id="overallComment" class="form-input" placeholder="Genel notunuz veya öneriniz..." rows="3" maxlength="500"></textarea>
                </div>
                ` : `
                <div class="form-group">
                    <textarea id="${commentId}" class="form-input" placeholder="Bu konuyla ilgili notunuz (isteğe bağlı)..." rows="2" maxlength="300"></textarea>
                </div>
                `}
            </div>`;
        });

        container.innerHTML = html;
        initStarRatingGroups();
        currentStep = 1;
        updateSurveyStepUI();
    }

    function initStarRatingGroups() {
        document.querySelectorAll('.star-rating-group').forEach(group => {
            const targetId = group.getAttribute('data-target');
            const hiddenInput = document.getElementById(targetId);
            const stars = group.querySelectorAll('.star-btn');

            stars.forEach(star => {
                star.addEventListener('click', function() {
                    const val = parseInt(this.getAttribute('data-val'));
                    if (hiddenInput) hiddenInput.value = val;
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
                const lastQ = loadedQuestions[totalSteps - 1] || {};
                const lastStarsId = `${lastQ.key_name || 'q_' + lastQ.id}Stars`;
                const overallStars = parseInt(document.getElementById(lastStarsId)?.value || document.getElementById('overallStars')?.value || '0');

                if (overallStars === 0) {
                    showToast('Lütfen puanınızı yıldızlarla belirtin.', 'error');
                    return;
                }

                const foodStars = parseInt(document.getElementById('foodStars')?.value || '0') || null;
                const serviceStars = parseInt(document.getElementById('serviceStars')?.value || '0') || null;
                const atmosphereStars = parseInt(document.getElementById('atmosphereStars')?.value || '0') || null;

                const payload = {
                    waiter_id: document.getElementById('surveyWaiterId')?.value || 1,
                    bill_id: document.getElementById('surveyBillId')?.value || null,
                    order_id: document.getElementById('surveyOrderId')?.value || null,
                    table_no: document.getElementById('surveyTableNo')?.value || null,
                    food_stars: foodStars || overallStars,
                    food_comment: document.getElementById('foodComment')?.value?.trim() || null,
                    service_stars: serviceStars || overallStars,
                    service_comment: document.getElementById('serviceComment')?.value?.trim() || null,
                    atmosphere_stars: atmosphereStars || overallStars,
                    atmosphere_comment: document.getElementById('atmosphereComment')?.value?.trim() || null,
                    overall_stars: overallStars,
                    comment: document.getElementById('overallComment')?.value?.trim() || null,
                    customer_name: document.getElementById('customerName')?.value?.trim() || 'Misafir'
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
        const stepEl = document.querySelector(`.survey-step[data-step="${step}"]`);
        if (!stepEl) return 0;
        const targetId = stepEl.querySelector('.star-rating-group')?.getAttribute('data-target');
        if (!targetId) return 0;
        return parseInt(document.getElementById(targetId)?.value || '0');
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
            progressFill.style.width = `${(currentStep / Math.max(totalSteps, 1)) * 100}%`;
        }

        const stepNumEl = document.getElementById('currentStepNum');
        if (stepNumEl) stepNumEl.textContent = currentStep;

        const badgeEl = document.getElementById('stepTitleBadge');
        if (badgeEl && loadedQuestions[currentStep - 1]) {
            badgeEl.textContent = loadedQuestions[currentStep - 1].category_name || `Adım ${currentStep}`;
        }

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
                        loadAdminQuestions();
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

                if (targetTab === 'tabQuestions') {
                    loadAdminQuestions();
                }
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

        initQuestionManagementForm();
    }

    function initQuestionManagementForm() {
        const form = document.getElementById('questionForm');
        const btnCancel = document.getElementById('btnCancelQuestionEdit');

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const editId = document.getElementById('qEditId').value;
                const title = document.getElementById('qTitle').value.trim();
                const subtitle = document.getElementById('qSubtitle').value.trim();
                const category = document.getElementById('qCategory').value.trim();
                const icon = document.getElementById('qIcon').value.trim() || 'fas fa-star';
                const sortOrder = parseInt(document.getElementById('qSortOrder').value || '1');
                const isActive = parseInt(document.getElementById('qIsActive').value || '1');

                const payload = {
                    title: title,
                    subtitle: subtitle,
                    category_name: category,
                    icon_class: icon,
                    sort_order: sortOrder,
                    is_active: isActive
                };

                const url = editId ? `/api/admin/questions/${editId}` : '/api/admin/questions';
                const method = editId ? 'PUT' : 'POST';

                try {
                    const res = await fetch(url, {
                        method: method,
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': csrfToken
                        },
                        body: JSON.stringify(payload)
                    });

                    if (res.ok) {
                        showToast(editId ? 'Soru başarıyla güncellendi!' : 'Yeni soru başarıyla eklendi!', 'success');
                        resetQuestionForm();
                        loadAdminQuestions();
                        loadCustomerQuestions();
                    } else {
                        showToast('İşlem sırasında hata oluştu.', 'error');
                    }
                } catch (e) {
                    showToast('Sunucu hatası oluştu.', 'error');
                }
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', () => {
                resetQuestionForm();
            });
        }
    }

    function resetQuestionForm() {
        document.getElementById('qEditId').value = '';
        document.getElementById('qTitle').value = '';
        document.getElementById('qSubtitle').value = '';
        document.getElementById('qCategory').value = '';
        document.getElementById('qIcon').value = 'fas fa-star';
        document.getElementById('qSortOrder').value = '1';
        document.getElementById('qIsActive').value = '1';

        const header = document.getElementById('questionFormHeader');
        if (header) header.innerHTML = `<i class="fas fa-plus-circle"></i> Yeni Anket Sorusu Ekle`;

        const btnCancel = document.getElementById('btnCancelQuestionEdit');
        if (btnCancel) btnCancel.style.display = 'none';

        const btnSave = document.getElementById('btnSaveQuestion');
        if (btnSave) btnSave.innerHTML = `<i class="fas fa-save"></i> Soruyu Kaydet`;
    }

    async function loadAdminQuestions() {
        const tbody = document.getElementById('adminQuestionsTbody');
        if (!tbody) return;

        tbody.innerHTML = `<tr><td colspan="7" class="text-center">Sorular yükleniyor...</td></tr>`;

        try {
            const res = await fetch('/api/questions');
            if (res.ok) {
                const questions = await res.json();
                renderAdminQuestionsTable(questions);
            }
        } catch (e) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center">Sorular yüklenirken hata oluştu.</td></tr>`;
        }
    }

    function renderAdminQuestionsTable(questions) {
        const tbody = document.getElementById('adminQuestionsTbody');
        if (!tbody) return;

        if (questions.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center">Kayıtlı anket sorusu bulunmuyor.</td></tr>`;
            return;
        }

        let html = '';
        questions.forEach(q => {
            html += `<tr>
                <td><strong>${q.sort_order || q.step_number || 1}</strong></td>
                <td><span class="step-badge">${q.category_name}</span></td>
                <td><i class="${q.icon_class || 'fas fa-star'}"></i></td>
                <td><strong>${q.title}</strong></td>
                <td>${q.subtitle || '-'}</td>
                <td>${q.is_active ? '<span class="status-badge status-open">Aktif</span>' : '<span class="status-badge status-closed">Pasif</span>'}</td>
                <td style="text-align:right">
                    <button class="btn btn-sm btn-outline btn-edit-q" data-q='${JSON.stringify(q)}'><i class="fas fa-edit"></i> Düzenle</button>
                    <button class="btn btn-sm btn-outline-danger btn-delete-q" data-id="${q.id}"><i class="fas fa-trash"></i> Sil</button>
                </td>
            </tr>`;
        });

        tbody.innerHTML = html;

        tbody.querySelectorAll('.btn-edit-q').forEach(btn => {
            btn.addEventListener('click', function() {
                const q = JSON.parse(this.getAttribute('data-q'));
                document.getElementById('qEditId').value = q.id;
                document.getElementById('qTitle').value = q.title || '';
                document.getElementById('qSubtitle').value = q.subtitle || '';
                document.getElementById('qCategory').value = q.category_name || '';
                document.getElementById('qIcon').value = q.icon_class || 'fas fa-star';
                document.getElementById('qSortOrder').value = q.sort_order || 1;
                document.getElementById('qIsActive').value = q.is_active ? '1' : '0';

                const header = document.getElementById('questionFormHeader');
                if (header) header.innerHTML = `<i class="fas fa-edit"></i> Soruyu Düzenle (#${q.id})`;

                const btnCancel = document.getElementById('btnCancelQuestionEdit');
                if (btnCancel) btnCancel.style.display = 'inline-flex';

                const btnSave = document.getElementById('btnSaveQuestion');
                if (btnSave) btnSave.innerHTML = `<i class="fas fa-save"></i> Güncelle`;

                document.getElementById('tabQuestions')?.scrollIntoView({ behavior: 'smooth' });
            });
        });

        tbody.querySelectorAll('.btn-delete-q').forEach(btn => {
            btn.addEventListener('click', async function() {
                const id = this.getAttribute('data-id');
                if (confirm('Bu soruyu silmek istediğinize emin misiniz?')) {
                    try {
                        const res = await fetch(`/api/admin/questions/${id}`, {
                            method: 'DELETE',
                            headers: {
                                'X-CSRF-TOKEN': csrfToken
                            }
                        });

                        if (res.ok) {
                            showToast('Soru başarıyla silindi.', 'success');
                            loadAdminQuestions();
                            loadCustomerQuestions();
                        } else {
                            showToast('Soru silinirken bir hata oluştu.', 'error');
                        }
                    } catch (e) {
                        showToast('Sunucu hatası oluştu.', 'error');
                    }
                }
            });
        });
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
