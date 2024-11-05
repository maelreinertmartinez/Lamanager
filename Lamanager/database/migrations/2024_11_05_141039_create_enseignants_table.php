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
            $table->id('idEnseignant');
            $table->foreignId('idRole')->constrained('role');
            $table->string('code', 10)->unique();
            $table->boolean('actif')->default(true);
            $table->string('motDePasse');
            $table->string('nom', 50);
            $table->string('prenom', 50);
            $table->string('mail', 50);
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
