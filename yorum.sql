-- Mikale Restoran Veri Tabanı SQL Dökümü
-- Tarih: 2026-08-13 13:52:57

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE "migrations" ("id" integer primary key autoincrement not null, "migration" varchar not null, "batch" integer not null);

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('1', '0001_01_01_000000_create_users_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('2', '0001_01_01_000001_create_cache_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('3', '0001_01_01_000002_create_jobs_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('4', '2024_01_01_000001_create_waiters_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('5', '2024_01_01_000002_create_bills_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('6', '2024_01_01_000003_create_reviews_table', '1');

DROP TABLE IF EXISTS `users`;
CREATE TABLE "users" ("id" integer primary key autoincrement not null, "name" varchar not null, "email" varchar not null, "email_verified_at" datetime, "password" varchar not null, "remember_token" varchar, "created_at" datetime, "updated_at" datetime);


DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE "password_reset_tokens" ("email" varchar not null, "token" varchar not null, "created_at" datetime, primary key ("email"));


DROP TABLE IF EXISTS `sessions`;
CREATE TABLE "sessions" ("id" varchar not null, "user_id" integer, "ip_address" varchar, "user_agent" text, "payload" text not null, "last_activity" integer not null, primary key ("id"));

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('ZId550H7ZzQLjbNAyNwmLwIxF4XbGIOXpDIM7QtB', NULL, '127.0.0.1', 'Go-http-client/1.1', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZTJ1WXJaMGNxVjJXWFdzQm9BaVhZdFVWVkN4ME9WQm90YkR3V1ZHOCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', '1786618197');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('4w2iYo79ksyPLtSgNR2oQFM12axhPwCh0xuSgezt', NULL, '127.0.0.1', 'Go-http-client/1.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUkxBQmZlQm56cXBSYWt2bGxTMHFzNlplQmJHZDhXeFRrMUlVemFwMSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Njg6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vbW9udGhseS1ldmFsdWF0aW9uP21vbnRoPTgmeWVhcj0yMDI2IjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', '1786618197');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('tdbCcHOhCDzL3K1blpH4BbmjITIG4lL0d7Ese3Uk', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:153.0) Gecko/20100101 Firefox/153.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieUxIblRmVXk1VElTa3NSRTlQUlM4TWU3M0JVYmhjNzd0WGhlc0F4SSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Njg6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vbW9udGhseS1ldmFsdWF0aW9uP21vbnRoPTgmeWVhcj0yMDI2IjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', '1786618472');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('m2gmTUKMlPp0AAdLEHfnAk8w3bb7k0eLk20wC5bB', NULL, '127.0.0.1', 'Go-http-client/1.1', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiaFE4S2s0MmowZlFPaFlhcmx5c0pWYm1vREJ1TlNueFRab0RXdjR2ciI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', '1786618474');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('Og9MSoVlGHLII7eYU2zhuUIADe2MKnh5MxUv6z9o', NULL, '127.0.0.1', 'Go-http-client/1.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicnZCYktKTmNMazVEWTRGNHUybVJ3Zzc0MUV2YlhSRjluMk5QZnFXWSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Njg6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vbW9udGhseS1ldmFsdWF0aW9uP21vbnRoPTgmeWVhcj0yMDI2IjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', '1786618474');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('Ddlz2oBmZftBRl3tP0S0l11bLDqIDMulL7wKjWxr', NULL, '127.0.0.1', 'Go-http-client/1.1', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoib20yWjQ0YnhkR2pseVFZakhEMTdYY2pwdUlSeTM4Z0k5eHZZbUg5cSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', '1786628470');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('AY3b6meFRf0Vzb7l5WRwIHqBeY5l0tFwfrXR9p14', NULL, '127.0.0.1', 'Go-http-client/1.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidVJqOGltN3g1Q0dYT0ZGY2p0VWlsMWpKbHU2TjN0UUNycXU4V2tlbiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', '1786628470');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('LxujJ7HL5Dq86p7yaHN5JSMpCbOiYu9GEDGtJ7ez', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:153.0) Gecko/20100101 Firefox/153.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYmo4YWdKQ3ZFMDVRaGRMczZ3TjVrTUk5dElUbUhZek5EN2FmRThnSCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Njg6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vbW9udGhseS1ldmFsdWF0aW9uP21vbnRoPTgmeWVhcj0yMDI2IjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', '1786628744');

DROP TABLE IF EXISTS `cache`;
CREATE TABLE "cache" ("key" varchar not null, "value" text not null, "expiration" integer not null, primary key ("key"));


DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE "cache_locks" ("key" varchar not null, "owner" varchar not null, "expiration" integer not null, primary key ("key"));


DROP TABLE IF EXISTS `jobs`;
CREATE TABLE "jobs" ("id" integer primary key autoincrement not null, "queue" varchar not null, "payload" text not null, "attempts" integer not null, "reserved_at" integer, "available_at" integer not null, "created_at" integer not null);


DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE "job_batches" ("id" varchar not null, "name" varchar not null, "total_jobs" integer not null, "pending_jobs" integer not null, "failed_jobs" integer not null, "failed_job_ids" text not null, "options" text, "cancelled_at" integer, "created_at" integer not null, "finished_at" integer, primary key ("id"));


DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE "failed_jobs" ("id" integer primary key autoincrement not null, "uuid" varchar not null, "connection" text not null, "queue" text not null, "payload" text not null, "exception" text not null, "failed_at" datetime not null default CURRENT_TIMESTAMP);


DROP TABLE IF EXISTS `waiters`;
CREATE TABLE "waiters" ("id" integer primary key autoincrement not null, "name" varchar not null, "photo" varchar, "phone" varchar, "created_at" datetime, "updated_at" datetime);

INSERT INTO `waiters` (`id`, `name`, `photo`, `phone`, `created_at`, `updated_at`) VALUES ('1', 'Emre Çavuş', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', '05551112233', '2026-08-13 10:49:54', '2026-08-13 10:49:54');
INSERT INTO `waiters` (`id`, `name`, `photo`, `phone`, `created_at`, `updated_at`) VALUES ('2', 'Mustafa Yanan', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', '05552223344', '2026-08-13 10:49:54', '2026-08-13 10:49:54');
INSERT INTO `waiters` (`id`, `name`, `photo`, `phone`, `created_at`, `updated_at`) VALUES ('3', 'Sıla Genç', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', '05553334455', '2026-08-13 10:49:54', '2026-08-13 10:49:54');

DROP TABLE IF EXISTS `bills`;
CREATE TABLE "bills" ("id" integer primary key autoincrement not null, "order_id" varchar, "table_no" integer not null, "waiter_id" integer not null, "items" text not null, "total" numeric not null, "status" varchar not null default 'open', "created_at" datetime, "updated_at" datetime, foreign key("waiter_id") references "waiters"("id") on delete cascade);

INSERT INTO `bills` (`id`, `order_id`, `table_no`, `waiter_id`, `items`, `total`, `status`, `created_at`, `updated_at`) VALUES ('1', 'SIP-1001', '4', '1', '[{\"name\":\"Adana Kebap\",\"price\":280,\"quantity\":2},{\"name\":\"\\u015ealgam\",\"price\":35,\"quantity\":2},{\"name\":\"K\\u00fcnefe\",\"price\":140,\"quantity\":1}]', '770', 'closed', '2026-08-11 10:49:54', '2026-08-13 10:49:54');
INSERT INTO `bills` (`id`, `order_id`, `table_no`, `waiter_id`, `items`, `total`, `status`, `created_at`, `updated_at`) VALUES ('2', 'SIP-1002', '12', '2', '[{\"name\":\"T-Bone Steak\",\"price\":650,\"quantity\":1},{\"name\":\"K\\u0131rm\\u0131z\\u0131 \\u015earap\",\"price\":400,\"quantity\":1}]', '1050', 'closed', '2026-08-09 10:49:54', '2026-08-13 10:49:54');
INSERT INTO `bills` (`id`, `order_id`, `table_no`, `waiter_id`, `items`, `total`, `status`, `created_at`, `updated_at`) VALUES ('3', 'SIP-1003', '2', '3', '[{\"name\":\"Deniz Mahsulleri Makarna\",\"price\":340,\"quantity\":2},{\"name\":\"Tiramisu\",\"price\":110,\"quantity\":2}]', '900', 'closed', '2026-08-07 10:49:54', '2026-08-13 10:49:54');
INSERT INTO `bills` (`id`, `order_id`, `table_no`, `waiter_id`, `items`, `total`, `status`, `created_at`, `updated_at`) VALUES ('4', 'SIP-1005', '4', '1', '[{\"name\":\"Kuzu Pirzola\",\"price\":420,\"quantity\":2},{\"name\":\"Meze Taba\\u011f\\u0131\",\"price\":180,\"quantity\":1},{\"name\":\"T\\u00fcrk Kahvesi\",\"price\":50,\"quantity\":2}]', '1120', 'closed', '2026-08-13 10:50:12', '2026-08-13 10:50:12');
INSERT INTO `bills` (`id`, `order_id`, `table_no`, `waiter_id`, `items`, `total`, `status`, `created_at`, `updated_at`) VALUES ('5', 'SIP-1004', '15', '3', '[{\"name\":\"Kuzu Pirzola\",\"price\":420,\"quantity\":2},{\"name\":\"Meze Taba\\u011f\\u0131\",\"price\":180,\"quantity\":1},{\"name\":\"T\\u00fcrk Kahvesi\",\"price\":50,\"quantity\":2}]', '1120', 'closed', '2026-08-13 10:51:35', '2026-08-13 10:51:35');
INSERT INTO `bills` (`id`, `order_id`, `table_no`, `waiter_id`, `items`, `total`, `status`, `created_at`, `updated_at`) VALUES ('6', 'SIP-1007', '8', '2', '[{\"name\":\"Kuzu Pirzola\",\"price\":420,\"quantity\":2},{\"name\":\"Meze Taba\\u011f\\u0131\",\"price\":180,\"quantity\":1},{\"name\":\"T\\u00fcrk Kahvesi\",\"price\":50,\"quantity\":2}]', '1120', 'closed', '2026-08-13 13:42:08', '2026-08-13 13:42:08');
INSERT INTO `bills` (`id`, `order_id`, `table_no`, `waiter_id`, `items`, `total`, `status`, `created_at`, `updated_at`) VALUES ('7', 'SIP-1007', '2', '1', '[{\"name\":\"Kuzu Pirzola\",\"price\":420,\"quantity\":2},{\"name\":\"Meze Taba\\u011f\\u0131\",\"price\":180,\"quantity\":1},{\"name\":\"T\\u00fcrk Kahvesi\",\"price\":50,\"quantity\":2}]', '1120', 'closed', '2026-08-13 13:43:55', '2026-08-13 13:43:55');

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE "reviews" ("id" integer primary key autoincrement not null, "waiter_id" integer not null, "bill_id" integer, "order_id" varchar, "table_no" integer, "food_stars" integer, "food_comment" text, "service_stars" integer, "service_comment" text, "atmosphere_stars" integer, "atmosphere_comment" text, "overall_stars" integer not null default '5', "stars" integer not null default '5', "comment" text, "customer_name" varchar not null default 'Misafir', "created_at" datetime, "updated_at" datetime, foreign key("waiter_id") references "waiters"("id") on delete cascade, foreign key("bill_id") references "bills"("id") on delete cascade);

INSERT INTO `reviews` (`id`, `waiter_id`, `bill_id`, `order_id`, `table_no`, `food_stars`, `food_comment`, `service_stars`, `service_comment`, `atmosphere_stars`, `atmosphere_comment`, `overall_stars`, `stars`, `comment`, `customer_name`, `created_at`, `updated_at`) VALUES ('1', '1', '1', 'SIP-1001', '4', '5', 'Kebaplar harikaydı, tam kıvamında pişmişti.', '5', 'Emre Bey çok kibar ve hızlıydı.', '4', 'Müzik sesi bir tık yüksekti ama ortam nezih.', '5', '5', 'Genel olarak unutulmaz bir akşam yemeğiydi.', 'Kemal Polat', '2026-08-11 10:49:54', '2026-08-13 10:49:54');
INSERT INTO `reviews` (`id`, `waiter_id`, `bill_id`, `order_id`, `table_no`, `food_stars`, `food_comment`, `service_stars`, `service_comment`, `atmosphere_stars`, `atmosphere_comment`, `overall_stars`, `stars`, `comment`, `customer_name`, `created_at`, `updated_at`) VALUES ('2', '2', '2', 'SIP-1002', '12', '4', 'Et biraz daha yumuşak olabilirdi.', '5', 'Servis hızı ve güler yüz mükemmel.', '5', 'Şamdanlar ve ışıklandırma harika.', '5', '5', 'Mustafa Bey harika ilgilendi.', 'Yasemin Çiçek', '2026-08-09 10:49:54', '2026-08-13 10:49:54');
INSERT INTO `reviews` (`id`, `waiter_id`, `bill_id`, `order_id`, `table_no`, `food_stars`, `food_comment`, `service_stars`, `service_comment`, `atmosphere_stars`, `atmosphere_comment`, `overall_stars`, `stars`, `comment`, `customer_name`, `created_at`, `updated_at`) VALUES ('3', '3', '3', 'SIP-1003', '2', '5', 'Makarna ve sos enfesti!', '4', 'Yoğunluktan dolayı biraz bekledik.', '5', 'Deniz manzaralı masa harikaydı.', '4', '4', 'Teşekkürler, tekrar geleceğiz.', 'Ali Duman', '2026-08-07 10:49:54', '2026-08-13 10:49:54');
INSERT INTO `reviews` (`id`, `waiter_id`, `bill_id`, `order_id`, `table_no`, `food_stars`, `food_comment`, `service_stars`, `service_comment`, `atmosphere_stars`, `atmosphere_comment`, `overall_stars`, `stars`, `comment`, `customer_name`, `created_at`, `updated_at`) VALUES ('4', '1', '4', 'SIP-1005', '4', '4', NULL, '5', NULL, '4', NULL, '4', '4', 'iyiydi', 'seher', '2026-08-13 10:51:09', '2026-08-13 10:51:09');
INSERT INTO `reviews` (`id`, `waiter_id`, `bill_id`, `order_id`, `table_no`, `food_stars`, `food_comment`, `service_stars`, `service_comment`, `atmosphere_stars`, `atmosphere_comment`, `overall_stars`, `stars`, `comment`, `customer_name`, `created_at`, `updated_at`) VALUES ('5', '2', '6', 'SIP-1007', '8', '4', NULL, '4', NULL, '5', NULL, '4', '4', NULL, 'Misafir', '2026-08-13 13:43:52', '2026-08-13 13:43:52');

