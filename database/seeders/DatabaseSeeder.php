<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Waiter;
use App\Models\Bill;
use App\Models\Review;
use App\Models\Question;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder {
    public function run(): void {
        Question::create([
            'step_number' => 1,
            'title' => 'Yemekler nasıldı?',
            'subtitle' => 'Lezzet ve sunum kalitesini puanlayın',
            'category_name' => 'Yemek Kalitesi',
            'icon_class' => 'fas fa-utensils',
            'key_name' => 'food',
            'is_active' => true,
            'sort_order' => 1
        ]);

        Question::create([
            'step_number' => 2,
            'title' => 'Garson ilgisi ve servis nasıldı?',
            'subtitle' => 'Hizmet hızını ve nezaketini puanlayın',
            'category_name' => 'Servis Kalitesi',
            'icon_class' => 'fas fa-user-tie',
            'key_name' => 'service',
            'is_active' => true,
            'sort_order' => 2
        ]);

        Question::create([
            'step_number' => 3,
            'title' => 'Mekan atmosferi ve temizlik nasıldı?',
            'subtitle' => 'Ortamın ambiansı ve temizliğini puanlayın',
            'category_name' => 'Mekan & Hijyen',
            'icon_class' => 'fas fa-concierge-bell',
            'key_name' => 'atmosphere',
            'is_active' => true,
            'sort_order' => 3
        ]);

        Question::create([
            'step_number' => 4,
            'title' => 'Genel Memnuniyetiniz',
            'subtitle' => 'Son değerlendirmenizi yapın',
            'category_name' => 'Genel Değerlendirme',
            'icon_class' => 'fas fa-award',
            'key_name' => 'overall',
            'is_active' => true,
            'sort_order' => 4
        ]);

        $w1 = Waiter::create(['name' => 'Emre Çavuş', 'photo' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'phone' => '05551112233']);
        $w2 = Waiter::create(['name' => 'Mustafa Yanan', 'photo' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'phone' => '05552223344']);
        $w3 = Waiter::create(['name' => 'Sıla Genç', 'photo' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'phone' => '05553334455']);

        $b1 = Bill::create([
            'order_id' => 'SIP-1001',
            'table_no' => 4,
            'waiter_id' => $w1->id,
            'items' => [
                ['name' => 'Adana Kebap', 'price' => 280, 'quantity' => 2],
                ['name' => 'Şalgam', 'price' => 35, 'quantity' => 2],
                ['name' => 'Künefe', 'price' => 140, 'quantity' => 1]
            ],
            'total' => 770.00,
            'status' => 'closed',
            'created_at' => Carbon::now()->subDays(2)
        ]);

        Review::create([
            'waiter_id' => $w1->id,
            'bill_id' => $b1->id,
            'order_id' => 'SIP-1001',
            'table_no' => 4,
            'food_stars' => 5,
            'food_comment' => 'Kebaplar harikaydı, tam kıvamında pişmişti.',
            'service_stars' => 5,
            'service_comment' => 'Emre Bey çok kibar ve hızlıydı.',
            'atmosphere_stars' => 4,
            'atmosphere_comment' => 'Müzik sesi bir tık yüksekti ama ortam nezih.',
            'overall_stars' => 5,
            'stars' => 5,
            'comment' => 'Genel olarak unutulmaz bir akşam yemeğiydi.',
            'customer_name' => 'Kemal Polat',
            'created_at' => Carbon::now()->subDays(2)
        ]);

        $b2 = Bill::create([
            'order_id' => 'SIP-1002',
            'table_no' => 12,
            'waiter_id' => $w2->id,
            'items' => [
                ['name' => 'T-Bone Steak', 'price' => 650, 'quantity' => 1],
                ['name' => 'Kırmızı Şarap', 'price' => 400, 'quantity' => 1]
            ],
            'total' => 1050.00,
            'status' => 'closed',
            'created_at' => Carbon::now()->subDays(4)
        ]);

        Review::create([
            'waiter_id' => $w2->id,
            'bill_id' => $b2->id,
            'order_id' => 'SIP-1002',
            'table_no' => 12,
            'food_stars' => 4,
            'food_comment' => 'Et biraz daha yumuşak olabilirdi.',
            'service_stars' => 5,
            'service_comment' => 'Servis hızı ve güler yüz mükemmel.',
            'atmosphere_stars' => 5,
            'atmosphere_comment' => 'Şamdanlar ve ışıklandırma harika.',
            'overall_stars' => 5,
            'stars' => 5,
            'comment' => 'Mustafa Bey harika ilgilendi.',
            'customer_name' => 'Yasemin Çiçek',
            'created_at' => Carbon::now()->subDays(4)
        ]);

        $b3 = Bill::create([
            'order_id' => 'SIP-1003',
            'table_no' => 2,
            'waiter_id' => $w3->id,
            'items' => [
                ['name' => 'Deniz Mahsulleri Makarna', 'price' => 340, 'quantity' => 2],
                ['name' => 'Tiramisu', 'price' => 110, 'quantity' => 2]
            ],
            'total' => 900.00,
            'status' => 'closed',
            'created_at' => Carbon::now()->subDays(6)
        ]);

        Review::create([
            'waiter_id' => $w3->id,
            'bill_id' => $b3->id,
            'order_id' => 'SIP-1003',
            'table_no' => 2,
            'food_stars' => 5,
            'food_comment' => 'Makarna ve sos enfesti!',
            'service_stars' => 4,
            'service_comment' => 'Yoğunluktan dolayı biraz bekledik.',
            'atmosphere_stars' => 5,
            'atmosphere_comment' => 'Deniz manzaralı masa harikaydı.',
            'overall_stars' => 4,
            'stars' => 4,
            'comment' => 'Teşekkürler, tekrar geleceğiz.',
            'customer_name' => 'Ali Duman',
            'created_at' => Carbon::now()->subDays(6)
        ]);
    }
}
