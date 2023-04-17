<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */

    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('category', 255)->nullable();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->foreign('parent_id')->references('id')->on('categories');
            $table->timestamps();
        });

        // Insert default values
        DB::table('categories')->insert([
            ['category' => 'Perishable'],
            ['category' => 'Non-Perishable'],
            ['category' => 'Vegetable', 'parent_id' => 1],
            ['category' => 'Utensil', 'parent_id' => 2],
        ]);
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
