<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Mikale - Garson Değerlendirme</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/css/app.css" rel="stylesheet">
</head>
<body>
    <div class="container">
        
        <div class="header">
            <div class="header-decoration">✦</div>
            <h1 class="restaurant-name">MİKALE</h1>
            <p class="restaurant-subtitle">"Lezzetin Zarif Adresi"</p>
            <div class="social-links">
                <a href="#" class="social-link" data-type="whatsapp"><i class="fab fa-whatsapp"></i></a>
                <a href="#" class="social-link" data-type="instagram"><i class="fab fa-instagram"></i></a>
            </div>
        </div>

        <div class="bill-section" id="billSection" style="display:none">
            <div class="section-title">
                <i class="fas fa-receipt"></i>
                Adisyon
            </div>
            <div class="bill-content" id="billContent">
                <div class="waiter-info" id="waiterInfo"></div>
                <div class="bill-table">
                    <table id="billItems"></table>
                </div>
                <div class="bill-total" id="billTotal"></div>
                <div class="bill-actions">
                    <button class="btn-print" id="btnPrint"><i class="fas fa-print"></i> Hesabı Yazdır</button>
                    <button class="btn-close-bill" id="btnCloseBill"><i class="fas fa-check"></i> Hesabı Kapat</button>
                </div>
            </div>
        </div>

        <div class="review-section" id="reviewSection" style="display:none">
            <div class="section-title">
                <i class="fas fa-star"></i>
                Garson Değerlendirmesi
            </div>
            <div class="review-form">
                <input type="hidden" id="waiterIdInput" value="">
                <div class="waiter-review-info" id="waiterReviewInfo"></div>
                <div class="rating-container">
                    <p class="rating-label">Hizmet puanınız:</p>
                    <div class="star-rating">
                        <span class="star" data-value="5"><i class="fas fa-star"></i></span>
                        <span class="star" data-value="4"><i class="fas fa-star"></i></span>
                        <span class="star" data-value="3"><i class="fas fa-star"></i></span>
                        <span class="star" data-value="2"><i class="fas fa-star"></i></span>
                        <span class="star" data-value="1"><i class="fas fa-star"></i></span>
                    </div>
                </div>
                <div class="form-group">
                    <textarea id="reviewComment" placeholder="Yorumunuzu yazın..." maxlength="500"></textarea>
                    <div class="char-count"><span id="charCount">0 / 500</span></div>
                </div>
                <div class="form-group">
                    <input type="text" id="customerName" placeholder="Adınız (isteğe bağlı)" value="">
                </div>
                <button class="btn-submit" id="btnSubmit"><i class="fas fa-paper-plane"></i> Değerlendirmeyi Gönder</button>
                <div class="success-message" id="successMessage" style="display:none">
                    <i class="fas fa-check-circle"></i> Değerlendirmeniz başarıyla kaydedildi!
                </div>
            </div>
        </div>

        <div class="reviews-list-section">
            <div class="section-title">
                <i class="fas fa-comments"></i>
                Son Değerlendirmeler
            </div>
            <div class="reviews-list" id="reviewsList">
                @if(isset($reviews) && count($reviews) > 0)
                    @foreach($reviews as $review)
                        <div class="review-card">
                            <div class="review-header">
                                <div class="reviewer-name"><i class="fas fa-user-circle"></i> {{ $review->customer_name ?? 'Misafir' }}</div>
                                <div class="review-date" data-date="{{ $review->created_at }}">{{ $review->created_at }}</div>
                            </div>
                            <div class="review-stars">
                                @for($i = 1; $i <= 5; $i++)
                                    @if($i <= $review->stars)
                                        <i class="fas fa-star"></i>
                                    @else
                                        <i class="far fa-star"></i>
                                    @endif
                                @endfor
                            </div>
                            @if(isset($review->waiter))
                                <div class="review-waiter">Garson: {{ $review->waiter->name }}</div>
                            @endif
                            @if($review->comment)
                                <div class="review-comment">{{ $review->comment }}</div>
                            @endif
                        </div>
                    @endforeach
                @else
                    <p style="color:var(--text-muted); text-align:center;">Henüz değerlendirme bulunmamaktadır.</p>
                @endif
            </div>
        </div>

        <div class="demo-section">
            <button class="btn-demo" id="btnDemo"><i class="fas fa-magic"></i> Demo Hesap Aç</button>
            <p class="demo-text">Test amaçlı örnek bir adisyon oluşturur</p>
        </div>

        <div class="footer">
            <div class="footer-content">
                <div class="footer-brand">
                    <h3>MİKALE</h3>
                    <p>"Lezzetin Zarif Adresi"</p>
                </div>
                <div class="footer-social">
                    <a href="#"><i class="fab fa-whatsapp"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                </div>
                <div class="footer-info">
                    <p>© 2024 Mikale - Tüm hakları saklıdır</p>
                    <p>Kemal Polat Yalçın</p>
                </div>
            </div>
        </div>

    </div>
    
    <script src="/js/app.js"></script>
</body>
</html>
