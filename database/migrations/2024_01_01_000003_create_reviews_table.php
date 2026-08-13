<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('waiter_id')->constrained('waiters')->cascadeOnDelete();
            $table->foreignId('bill_id')->nullable()->constrained('bills')->cascadeOnDelete();
            $table->string('order_id')->nullable();
            $table->integer('table_no')->nullable();
            $table->tinyInteger('food_stars')->nullable();
            $table->text('food_comment')->nullable();
            $table->tinyInteger('service_stars')->nullable();
            $table->text('service_comment')->nullable();
            $table->tinyInteger('atmosphere_stars')->nullable();
            $table->text('atmosphere_comment')->nullable();
            $table->tinyInteger('overall_stars')->default(5);
            $table->tinyInteger('stars')->default(5);
            $table->text('comment')->nullable();
            $table->string('customer_name')->default('Misafir');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('reviews');
    }
};
