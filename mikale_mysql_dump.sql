-- Mikale Restoran MySQL Veri Tabanı Dökümü
-- Tarih: 2026-08-15 14:58:58
-- Uyumlu Sistem: MySQL 5.7+ / MySQL 8.0+ / MariaDB

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+00:00';

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('1', '0001_01_01_000000_create_users_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('2', '0001_01_01_000001_create_cache_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('3', '0001_01_01_000002_create_jobs_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('4', '2024_01_01_000001_create_waiters_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('5', '2024_01_01_000002_create_bills_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('6', '2024_01_01_000003_create_reviews_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('7', '2024_01_01_000004_create_questions_table', '1');

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `waiters`;
CREATE TABLE `waiters` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `waiters` (`id`, `name`, `photo`, `phone`, `created_at`, `updated_at`) VALUES ('1', 'Emre Çavuş', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', '05551112233', '2026-08-15 14:49:01', '2026-08-15 14:49:01');
INSERT INTO `waiters` (`id`, `name`, `photo`, `phone`, `created_at`, `updated_at`) VALUES ('2', 'Mustafa Yanan', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', '05552223344', '2026-08-15 14:49:01', '2026-08-15 14:49:01');
INSERT INTO `waiters` (`id`, `name`, `photo`, `phone`, `created_at`, `updated_at`) VALUES ('3', 'Sıla Genç', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', '05553334455', '2026-08-15 14:49:01', '2026-08-15 14:49:01');

DROP TABLE IF EXISTS `bills`;
CREATE TABLE `bills` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` varchar(255) DEFAULT NULL,
  `table_no` int(11) NOT NULL,
  `waiter_id` bigint(20) unsigned NOT NULL,
  `items` longtext NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'open',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bills_waiter_id_foreign` (`waiter_id`),
  CONSTRAINT `bills_waiter_id_foreign` FOREIGN KEY (`waiter_id`) REFERENCES `waiters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `bills` (`id`, `order_id`, `table_no`, `waiter_id`, `items`, `total`, `status`, `created_at`, `updated_at`) VALUES ('1', 'SIP-1001', '4', '1', '[{\"name\":\"Adana Kebap\",\"price\":280,\"quantity\":2},{\"name\":\"\\u015ealgam\",\"price\":35,\"quantity\":2},{\"name\":\"K\\u00fcnefe\",\"price\":140,\"quantity\":1}]', '770', 'closed', '2026-08-13 14:49:01', '2026-08-15 14:49:01');
INSERT INTO `bills` (`id`, `order_id`, `table_no`, `waiter_id`, `items`, `total`, `status`, `created_at`, `updated_at`) VALUES ('2', 'SIP-1002', '12', '2', '[{\"name\":\"T-Bone Steak\",\"price\":650,\"quantity\":1},{\"name\":\"K\\u0131rm\\u0131z\\u0131 \\u015earap\",\"price\":400,\"quantity\":1}]', '1050', 'closed', '2026-08-11 14:49:01', '2026-08-15 14:49:01');
INSERT INTO `bills` (`id`, `order_id`, `table_no`, `waiter_id`, `items`, `total`, `status`, `created_at`, `updated_at`) VALUES ('3', 'SIP-1003', '2', '3', '[{\"name\":\"Deniz Mahsulleri Makarna\",\"price\":340,\"quantity\":2},{\"name\":\"Tiramisu\",\"price\":110,\"quantity\":2}]', '900', 'closed', '2026-08-09 14:49:01', '2026-08-15 14:49:01');
INSERT INTO `bills` (`id`, `order_id`, `table_no`, `waiter_id`, `items`, `total`, `status`, `created_at`, `updated_at`) VALUES ('4', 'SIP-1006', '11', '1', '[{\"name\":\"Kuzu Pirzola\",\"price\":420,\"quantity\":2},{\"name\":\"Meze Taba\\u011f\\u0131\",\"price\":180,\"quantity\":1},{\"name\":\"T\\u00fcrk Kahvesi\",\"price\":50,\"quantity\":2}]', '1120', 'closed', '2026-08-15 14:50:06', '2026-08-15 14:50:06');
INSERT INTO `bills` (`id`, `order_id`, `table_no`, `waiter_id`, `items`, `total`, `status`, `created_at`, `updated_at`) VALUES ('5', 'SIP-1007', '1', '1', '[{\"name\":\"Kuzu Pirzola\",\"price\":420,\"quantity\":2},{\"name\":\"Meze Taba\\u011f\\u0131\",\"price\":180,\"quantity\":1},{\"name\":\"T\\u00fcrk Kahvesi\",\"price\":50,\"quantity\":2}]', '1120', 'closed', '2026-08-15 14:53:40', '2026-08-15 14:53:40');

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `waiter_id` bigint(20) unsigned NOT NULL,
  `bill_id` bigint(20) unsigned DEFAULT NULL,
  `order_id` varchar(255) DEFAULT NULL,
  `table_no` int(11) DEFAULT NULL,
  `food_stars` tinyint(4) DEFAULT NULL,
  `food_comment` text DEFAULT NULL,
  `service_stars` tinyint(4) DEFAULT NULL,
  `service_comment` text DEFAULT NULL,
  `atmosphere_stars` tinyint(4) DEFAULT NULL,
  `atmosphere_comment` text DEFAULT NULL,
  `overall_stars` tinyint(4) NOT NULL DEFAULT 5,
  `stars` tinyint(4) NOT NULL DEFAULT 5,
  `comment` text DEFAULT NULL,
  `customer_name` varchar(255) NOT NULL DEFAULT 'Misafir',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reviews_waiter_id_foreign` (`waiter_id`),
  KEY `reviews_bill_id_foreign` (`bill_id`),
  CONSTRAINT `reviews_bill_id_foreign` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_waiter_id_foreign` FOREIGN KEY (`waiter_id`) REFERENCES `waiters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `reviews` (`id`, `waiter_id`, `bill_id`, `order_id`, `table_no`, `food_stars`, `food_comment`, `service_stars`, `service_comment`, `atmosphere_stars`, `atmosphere_comment`, `overall_stars`, `stars`, `comment`, `customer_name`, `created_at`, `updated_at`) VALUES ('1', '1', '1', 'SIP-1001', '4', '5', 'Kebaplar harikaydı, tam kıvamında pişmişti.', '5', 'Emre Bey çok kibar ve hızlıydı.', '4', 'Müzik sesi bir tık yüksekti ama ortam nezih.', '5', '5', 'Genel olarak unutulmaz bir akşam yemeğiydi.', 'Kemal Polat', '2026-08-13 14:49:01', '2026-08-15 14:49:01');
INSERT INTO `reviews` (`id`, `waiter_id`, `bill_id`, `order_id`, `table_no`, `food_stars`, `food_comment`, `service_stars`, `service_comment`, `atmosphere_stars`, `atmosphere_comment`, `overall_stars`, `stars`, `comment`, `customer_name`, `created_at`, `updated_at`) VALUES ('2', '2', '2', 'SIP-1002', '12', '4', 'Et biraz daha yumuşak olabilirdi.', '5', 'Servis hızı ve güler yüz mükemmel.', '5', 'Şamdanlar ve ışıklandırma harika.', '5', '5', 'Mustafa Bey harika ilgilendi.', 'Yasemin Çiçek', '2026-08-11 14:49:01', '2026-08-15 14:49:01');
INSERT INTO `reviews` (`id`, `waiter_id`, `bill_id`, `order_id`, `table_no`, `food_stars`, `food_comment`, `service_stars`, `service_comment`, `atmosphere_stars`, `atmosphere_comment`, `overall_stars`, `stars`, `comment`, `customer_name`, `created_at`, `updated_at`) VALUES ('3', '3', '3', 'SIP-1003', '2', '5', 'Makarna ve sos enfesti!', '4', 'Yoğunluktan dolayı biraz bekledik.', '5', 'Deniz manzaralı masa harikaydı.', '4', '4', 'Teşekkürler, tekrar geleceğiz.', 'Ali Duman', '2026-08-09 14:49:01', '2026-08-15 14:49:01');

DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `step_number` int(11) NOT NULL DEFAULT 1,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `category_name` varchar(255) NOT NULL DEFAULT 'Genel',
  `icon_class` varchar(255) NOT NULL DEFAULT 'fas fa-star',
  `key_name` varchar(255) NOT NULL DEFAULT 'custom',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `questions` (`id`, `step_number`, `title`, `subtitle`, `category_name`, `icon_class`, `key_name`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES ('1', '1', 'Yemekler nasıldı?', 'Lezzet ve sunum kalitesini puanlayın', 'Yemek Kalitesi', 'fas fa-utensils', 'food', '1', '1', '2026-08-15 14:49:01', '2026-08-15 14:49:01');
INSERT INTO `questions` (`id`, `step_number`, `title`, `subtitle`, `category_name`, `icon_class`, `key_name`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES ('2', '2', 'Garson ilgisi ve servis nasıldı?', 'Hizmet hızını ve nezaketini puanlayın', 'Servis Kalitesi', 'fas fa-user-tie', 'service', '1', '2', '2026-08-15 14:49:01', '2026-08-15 14:49:01');
INSERT INTO `questions` (`id`, `step_number`, `title`, `subtitle`, `category_name`, `icon_class`, `key_name`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES ('3', '3', 'Mekan atmosferi ve temizlik nasıldı?', 'Ortamın ambiansı ve temizliğini puanlayın', 'Mekan & Hijyen', 'fas fa-concierge-bell', 'atmosphere', '1', '3', '2026-08-15 14:49:01', '2026-08-15 14:49:01');
INSERT INTO `questions` (`id`, `step_number`, `title`, `subtitle`, `category_name`, `icon_class`, `key_name`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES ('4', '4', 'Genel Memnuniyetiniz', 'Son değerlendirmenizi yapın', 'Genel Değerlendirme', 'fas fa-award', 'overall', '1', '4', '2026-08-15 14:49:01', '2026-08-15 14:49:01');
INSERT INTO `questions` (`id`, `step_number`, `title`, `subtitle`, `category_name`, `icon_class`, `key_name`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES ('5', '5', 'atmosfer nasildi', 'restoranimizin atmosferini begendiniz mi', 'atmosfer', 'fas fa-star', 'custom_1786805565', '1', '5', '2026-08-15 14:52:45', '2026-08-15 14:53:15');

SET FOREIGN_KEY_CHECKS=1;
