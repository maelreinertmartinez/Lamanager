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
        Schema::table('semaines', function (Blueprint $table) {
            $table->foreignId('annee_id')->constrained()->onDelete('cascade');
            $table->date('date_debut');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('semaines', function (Blueprint $table) {
            $table->dropForeign(['annee_id']);
            $table->dropColumn(['annee_id', 'date_debut']);
        });
    }
};
