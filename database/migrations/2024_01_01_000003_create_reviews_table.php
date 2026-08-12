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
            $table->tinyInteger('stars');
            $table->text('comment')->nullable();
            $table->string('customer_name')->default('Anonim');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('reviews');
    }
};
