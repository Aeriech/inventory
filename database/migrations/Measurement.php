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
        Schema::create('measurements', function (Blueprint $table) {
            $table->id();
            $table->string('measurement', 255)->nullable();
            $table->timestamps();
        });

        // Insert default values
        DB::table('measurements')->insert([
            ['measurement' => 'Quantity'],
            ['measurement' => 'Kilogram'],
            ['measurement' => 'Liters'],

        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('measurements');
    }
};
