<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('external_id', 50)->unique()->nullable();
            $table->string('name', 255);
            $table->decimal('price', 10, 2);
            $table->text('description');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->text('how_to_use')->nullable();
            $table->text('warnings')->nullable();
            $table->string('image_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
