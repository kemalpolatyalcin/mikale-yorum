<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('bills', function (Blueprint $table) {
            $table->id();
            $table->integer('table_no');
            $table->foreignId('waiter_id')->constrained('waiters')->cascadeOnDelete();
            $table->json('items');
            $table->decimal('total', 10, 2);
            $table->string('status')->default('open');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('bills');
    }
};
