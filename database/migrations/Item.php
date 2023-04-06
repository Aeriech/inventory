<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255)->unique();
            $table->string('image', 255)->nullable();
            $table->decimal('price', 20, 2)->nullable();
            $table->bigInteger('measurement')->unsigned()->nullable();
            $table->string('type', 255);
            $table->string('measured_in', 255);
            $table->unsignedBigInteger('category_id')->nullable();
            $table->string('status', 255)->nullable();
            $table->timestamps();
            $table->foreign('category_id')->references('id')->on('categories');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
