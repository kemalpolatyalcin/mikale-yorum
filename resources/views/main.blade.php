<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Mikale - Garson & Sipariş Değerlendirme</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/css/app.css" rel="stylesheet">
</head>
<body>
    <div class="app-wrapper">
        <div id="customerApp">
            <header class="restaurant-header">
                <div class="brand-crest">✦</div>
                <h1 class="restaurant-name">MİKALE</h1>
                <p class="restaurant-tagline">"Lezzetin Zarif Adresi"</p>
                <div class="social-badges">
                    <a href="#" class="social-badge"><i class="fab fa-whatsapp"></i></a>
                    <a href="#" class="social-badge"><i class="fab fa-instagram"></i></a>
                </div>
            </header>

            <main class="container">
                <section class="card bill-card" id="billSection" style="display:none">
                    <div class="card-header">
                        <i class="fas fa-receipt"></i>
                        <span id="billTitleText">Adisyon & Sipariş Detayı</span>
                    </div>
                    <div class="card-body">
                        <div class="waiter-banner" id="waiterBanner"></div>
                        <div class="table-responsive">
                            <table class="bill-table" id="billItems"></table>
                        </div>
                        <div class="bill-summary" id="billSummary"></div>
                    </div>
                </section>

                <section class="card survey-card" id="surveySection" style="display:none">
                    <div class="survey-progress-bar">
                        <div class="survey-progress-fill" id="surveyProgressFill"></div>
                    </div>
                    <div class="survey-step-indicator">
                        <span>Soru <strong id="currentStepNum">1</strong> / 4</span>
                        <span id="stepTitleBadge" class="step-badge">Yemek Kalitesi</span>
                    </div>

                    <form id="surveyForm" onsubmit="return false;">
                        <input type="hidden" id="surveyBillId" value="">
                        <input type="hidden" id="surveyOrderId" value="">
                        <input type="hidden" id="surveyTableNo" value="">
                        <input type="hidden" id="surveyWaiterId" value="1">

                        <div class="survey-step active" data-step="1">
                            <div class="step-icon"><i class="fas fa-utensils"></i></div>
                            <h2 class="step-heading">Yemekler nasıldı?</h2>
                            <p class="step-subheading">Lezzet ve sunum kalitesini puanlayın</p>
                            <div class="star-rating-group" data-target="foodStars">
                                <span class="star-btn" data-val="5"><i class="fas fa-star"></i></span>
                                <span class="star-btn" data-val="4"><i class="fas fa-star"></i></span>
                                <span class="star-btn" data-val="3"><i class="fas fa-star"></i></span>
                                <span class="star-btn" data-val="2"><i class="fas fa-star"></i></span>
                                <span class="star-btn" data-val="1"><i class="fas fa-star"></i></span>
                            </div>
                            <input type="hidden" id="foodStars" value="0">
                            <div class="form-group">
                                <textarea id="foodComment" class="form-input" placeholder="Yemeklerle ilgili notunuz (isteğe bağlı)..." rows="2" maxlength="300"></textarea>
                            </div>
                        </div>

                        <div class="survey-step" data-step="2">
                            <div class="step-icon"><i class="fas fa-user-tie"></i></div>
                            <h2 class="step-heading">Garson ilgisi ve servis nasıldı?</h2>
                            <p class="step-subheading">Hizmet hızını ve nezaketini puanlayın</p>
                            <div class="star-rating-group" data-target="serviceStars">
                                <span class="star-btn" data-val="5"><i class="fas fa-star"></i></span>
                                <span class="star-btn" data-val="4"><i class="fas fa-star"></i></span>
                                <span class="star-btn" data-val="3"><i class="fas fa-star"></i></span>
                                <span class="star-btn" data-val="2"><i class="fas fa-star"></i></span>
                                <span class="star-btn" data-val="1"><i class="fas fa-star"></i></span>
                            </div>
                            <input type="hidden" id="serviceStars" value="0">
                            <div class="form-group">
                                <textarea id="serviceComment" class="form-input" placeholder="Servis ile ilgili görüşünüz (isteğe bağlı)..." rows="2" maxlength="300"></textarea>
                            </div>
                        </div>

                        <div class="survey-step" data-step="3">
                            <div class="step-icon"><i class="fas fa-concierge-bell"></i></div>
                            <h2 class="step-heading">Mekan atmosferi ve temizlik nasıldı?</h2>
                            <p class="step-subheading">Ortamın ambiansı ve temizliğini puanlayın</p>
                            <div class="star-rating-group" data-target="atmosphereStars">
                                <span class="star-btn" data-val="5"><i class="fas fa-star"></i></span>
                                <span class="star-btn" data-val="4"><i class="fas fa-star"></i></span>
                                <span class="star-btn" data-val="3"><i class="fas fa-star"></i></span>
                                <span class="star-btn" data-val="2"><i class="fas fa-star"></i></span>
                                <span class="star-btn" data-val="1"><i class="fas fa-star"></i></span>
                            </div>
                            <input type="hidden" id="atmosphereStars" value="0">
                            <div class="form-group">
                                <textarea id="atmosphereComment" class="form-input" placeholder="Mekan ile ilgili notunuz (isteğe bağlı)..." rows="2" maxlength="300"></textarea>
                            </div>
                        </div>

                        <div class="survey-step" data-step="4">
                            <div class="step-icon"><i class="fas fa-award"></i></div>
                            <h2 class="step-heading">Genel Memnuniyetiniz</h2>
                            <p class="step-subheading">Son değerlendirmenizi yapın</p>
                            <div class="star-rating-group" data-target="overallStars">
                                <span class="star-btn" data-val="5"><i class="fas fa-star"></i></span>
                                <span class="star-btn" data-val="4"><i class="fas fa-star"></i></span>
                                <span class="star-btn" data-val="3"><i class="fas fa-star"></i></span>
                                <span class="star-btn" data-val="2"><i class="fas fa-star"></i></span>
                                <span class="star-btn" data-val="1"><i class="fas fa-star"></i></span>
                            </div>
                            <input type="hidden" id="overallStars" value="0">
                            <div class="form-group margin-top">
                                <input type="text" id="customerName" class="form-input" placeholder="Adınız (isteğe bağlı)" value="">
                            </div>
                            <div class="form-group">
                                <textarea id="overallComment" class="form-input" placeholder="Genel notunuz veya öneriniz..." rows="3" maxlength="500"></textarea>
                            </div>
                        </div>

                        <div class="survey-actions">
                            <button type="button" class="btn btn-secondary" id="btnPrevStep" style="display:none">
                                <i class="fas fa-arrow-left"></i> Önceki
                            </button>
                            <button type="button" class="btn btn-primary" id="btnNextStep">
                                Sonraki <i class="fas fa-arrow-right"></i>
                            </button>
                            <button type="button" class="btn btn-gold" id="btnSubmitSurvey" style="display:none">
                                <i class="fas fa-paper-plane"></i> Değerlendirmeyi Tamamla
                            </button>
                        </div>
                    </form>

                    <div class="survey-success-card" id="surveySuccess" style="display:none">
                        <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                        <h2>Teşekkür Ederiz!</h2>
                        <p>Değerlendirmeniz başarıyla kaydedildi. Görüşleriniz hizmet kalitemizi artırmamıza yardımcı oluyor.</p>
                        <button class="btn btn-outline" id="btnResetSurvey"><i class="fas fa-redo"></i> Yeni Değerlendirme</button>
                    </div>
                </section>

                <section class="card reviews-feed-card">
                    <div class="card-header">
                        <i class="fas fa-comments"></i>
                        <span>Son Müşteri Yorumları</span>
                    </div>
                    <div class="card-body">
                        <div class="reviews-grid" id="publicReviewsGrid">
                            @if(isset($reviews) && count($reviews) > 0)
                                @foreach($reviews as $review)
                                    <div class="review-tile">
                                        <div class="tile-header">
                                            <div class="tile-user">
                                                <i class="fas fa-user-circle"></i>
                                                <span>{{ $review->customer_name }}</span>
                                            </div>
                                            <div class="tile-time">{{ $review->created_at->diffForHumans() }}</div>
                                        </div>
                                        <div class="tile-stars">
                                            @for($i = 1; $i <= 5; $i++)
                                                <i class="{{ $i <= $review->overall_stars ? 'fas fa-star' : 'far fa-star' }}"></i>
                                            @endfor
                                        </div>
                                        @if($review->waiter)
                                            <div class="tile-waiter">Garson: <strong>{{ $review->waiter->name }}</strong></div>
                                        @endif
                                        @if($review->comment)
                                            <div class="tile-body">{{ $review->comment }}</div>
                                        @endif
                                    </div>
                                @endforeach
                            @else
                                <p class="empty-msg">Henüz değerlendirme yapılmamış.</p>
                            @endif
                        </div>
                    </div>
                </section>

                <div class="demo-trigger-box">
                    <button class="btn btn-demo" id="btnSimulateDesktopBill">
                        <i class="fas fa-desktop"></i> Masaüstü Pos'tan Hesap Kapat
                    </button>
                </div>
            </main>
        </div>

        <div id="adminLoginApp" style="display:none">
            <div class="login-wrapper">
                <div class="login-card">
                    <div class="login-brand">
                        <div class="brand-crest">✦</div>
                        <h2>MİKALE RESTORAN</h2>
                        <p>Yönetim Paneli Girişi</p>
                    </div>
                    <form id="adminLoginForm" onsubmit="return false;">
                        <div class="form-group">
                            <label><i class="fas fa-user"></i> Kullanıcı Adı</label>
                            <input type="text" id="adminUsername" class="form-input" placeholder="admin" required>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-key"></i> Şifre</label>
                            <input type="password" id="adminPassword" class="form-input" placeholder="••••••••" required>
                        </div>
                        <div id="loginErrorMsg" class="alert alert-error" style="display:none"></div>
                        <button type="submit" class="btn btn-gold btn-block" id="btnAdminLogin">
                            <i class="fas fa-sign-in-alt"></i> Panele Giriş Yap
                        </button>
                    </form>
                    <div class="login-footer">
                        <a href="/" class="link-muted"><i class="fas fa-arrow-left"></i> Ana Sayfaya Dön</a>
                    </div>
                </div>
            </div>
        </div>

        <div id="adminDashboardApp" style="display:none">
            <header class="admin-topbar">
                <div class="admin-brand">
                    <span class="brand-crest">✦</span>
                    <strong>MİKALE</strong> YÖNETİM PANELİ
                </div>
                <div class="admin-user-info">
                    <span id="adminUserName">Restoran Yöneticisi</span>
                    <button class="btn btn-sm btn-outline-danger" id="btnAdminLogout"><i class="fas fa-sign-out-alt"></i> Çıkış</button>
                </div>
            </header>

            <div class="admin-container">
                <div class="admin-nav-tabs">
                    <button class="tab-btn active" data-tab="tabReviews"><i class="fas fa-list-alt"></i> Sipariş & Garson Yorumları</button>
                    <button class="tab-btn" data-tab="tabMonthlyEval"><i class="fas fa-chart-line"></i> Ay Sonu Değerlendirmesi</button>
                </div>

                <div class="tab-content active" id="tabReviews">
                    <div class="card filter-card">
                        <div class="card-header"><i class="fas fa-filter"></i> Filtreleme Seçenekleri</div>
                        <div class="card-body">
                            <div class="filter-grid">
                                <div class="filter-item">
                                    <label>Sipariş ID (Sipariş No)</label>
                                    <input type="text" id="filterOrderId" class="form-input" placeholder="Örn: SIP-1001">
                                </div>
                                <div class="filter-item">
                                    <label>Garson</label>
                                    <select id="filterWaiterId" class="form-input">
                                        <option value="">Tüm Garsonlar</option>
                                        @foreach($waiters as $w)
                                            <option value="{{ $w->id }}">{{ $w->name }}</option>
                                        @endforeach
                                    </select>
                                </div>
                                <div class="filter-item">
                                    <label>Masa No</label>
                                    <input type="number" id="filterTableNo" class="form-input" placeholder="Masa No">
                                </div>
                                <div class="filter-item">
                                    <label>Puan (Yıldız)</label>
                                    <select id="filterStars" class="form-input">
                                        <option value="">Tüm Puanlar</option>
                                        <option value="5">5 Yıldız</option>
                                        <option value="4">4 Yıldız</option>
                                        <option value="3">3 Yıldız</option>
                                        <option value="2">2 Yıldız</option>
                                        <option value="1">1 Yıldız</option>
                                    </select>
                                </div>
                            </div>
                            <div class="filter-actions">
                                <button class="btn btn-primary" id="btnApplyFilters"><i class="fas fa-search"></i> Filtrele</button>
                                <button class="btn btn-secondary" id="btnResetFilters"><i class="fas fa-undo"></i> Temizle</button>
                            </div>
                        </div>
                    </div>

                    <div class="card table-card">
                        <div class="card-header"><i class="fas fa-table"></i> Yorum ve Değerlendirme Listesi</div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Sipariş ID</th>
                                            <th>Masa No</th>
                                            <th>Garson</th>
                                            <th>Yemek Puanı</th>
                                            <th>Servis Puanı</th>
                                            <th>Atmosfer Puanı</th>
                                            <th>Genel Puan</th>
                                            <th>Not / Yorum</th>
                                            <th>Müşteri</th>
                                            <th>Tarih</th>
                                        </tr>
                                    </thead>
                                    <tbody id="adminReviewsTbody">
                                        <tr><td colspan="10" class="text-center">Yükleniyor...</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tab-content" id="tabMonthlyEval">
                    <div class="card filter-card">
                        <div class="card-header"><i class="fas fa-calendar-alt"></i> Ay Sonu Değerlendirme Dönemi</div>
                        <div class="card-body">
                            <div class="filter-grid inline">
                                <div class="filter-item">
                                    <label>Ay</label>
                                    <select id="evalMonth" class="form-input">
                                        <option value="1">Ocak</option>
                                        <option value="2">Şubat</option>
                                        <option value="3">Mart</option>
                                        <option value="4">Nisan</option>
                                        <option value="5">Mayıs</option>
                                        <option value="6">Haziran</option>
                                        <option value="7">Temmuz</option>
                                        <option value="8" selected>Ağustos</option>
                                        <option value="9">Eylül</option>
                                        <option value="10">Ekim</option>
                                        <option value="11">Kasım</option>
                                        <option value="12">Aralık</option>
                                    </select>
                                </div>
                                <div class="filter-item">
                                    <label>Yıl</label>
                                    <select id="evalYear" class="form-input">
                                        <option value="2026" selected>2026</option>
                                        <option value="2025">2025</option>
                                    </select>
                                </div>
                                <div class="filter-item align-end">
                                    <button class="btn btn-gold" id="btnLoadMonthlyEval"><i class="fas fa-sync"></i> Raporu Getir</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card eval-card">
                        <div class="card-header"><i class="fas fa-trophy"></i> Ay Sonu Garson Performans Sıralaması</div>
                        <div class="card-body">
                            <div class="leaderboard-grid" id="leaderboardGrid"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <footer class="app-footer">
            <p>© 2026 Mikale Restoran Yönetim & Değerlendirme Sistemi</p>
        </footer>
    </div>

    <script src="/js/app.js"></script>
</body>
</html>
