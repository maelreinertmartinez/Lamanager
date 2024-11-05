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
        Schema::create('enseignant', function (Blueprint $table) {
            $table->id();
            $table->boolean('alternant')->default(false);
            $table->string('nom');
            $table->integer('nombreHeureCM', 5);
            $table->integer('nombreHeureTD', 5);
            $table->integer('nombreHeureTP', 5);
            $table->integer('Semestre', 1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enseignant');
    }
};
