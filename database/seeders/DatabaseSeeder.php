<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Waiter;
use App\Models\Review;
class DatabaseSeeder extends Seeder {
    public function run(): void {
        $waiter1 = Waiter::create(['name' => 'Emre Çavuş']);
        $waiter2 = Waiter::create(['name' => 'Mehmet Kaya']);
        $waiter3 = Waiter::create(['name' => 'Ali Demir']);
        Review::create([
            'waiter_id' => $waiter1->id,
            'stars' => 5,
            'comment' => 'Çok memnun kaldık, teşekkürler.',
            'customer_name' => 'Kemal'
        ]);
    }
}
