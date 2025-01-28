<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTestTables extends Migration
{
    public function up()
    {
        Schema::dropIfExists('case_tableau_enseignant');
        Schema::dropIfExists('cases_tableau');
        Schema::dropIfExists('enseignements');
        Schema::dropIfExists('groupes');
        Schema::dropIfExists('promos');
        Schema::dropIfExists('enseignants');
        Schema::dropIfExists('annees');

        Schema::create('annees', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('annee');
            $table->timestamps();
        });

        Schema::create('enseignants', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->string('email');
            $table->string('statut');
            $table->timestamps();
        });

        Schema::create('promos', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->integer('nombre_td');
            $table->integer('nombre_tp');
            $table->boolean('alternant');
            $table->integer('nb_etudiants');
            $table->foreignId('annee_id')->constrained('annees');
            $table->timestamps();
        });

        Schema::create('groupes', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('type');
            $table->foreignId('promo_id')->constrained('promos');
            $table->timestamps();
        });

        Schema::create('enseignements', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->foreignId('promo_id')->constrained('promos');
            $table->boolean('alternant');
            $table->integer('nombre_heures_cm');
            $table->integer('nombre_heures_td');
            $table->integer('nombre_heures_tp');
            $table->integer('nombre_heures_projet');
            $table->integer('semestre');
            $table->timestamps();
        });

        Schema::create('cases_tableau', function (Blueprint $table) {
            $table->id();
            $table->integer('heures');
            $table->string('commentaire')->nullable();
            $table->integer('semaine');
            $table->foreignId('enseignement_id')->constrained('enseignements');
            $table->timestamps();
        });

        Schema::create('case_tableau_enseignant', function (Blueprint $table) {
            $table->foreignId('case_tableau_id')->constrained('cases_tableau');
            $table->foreignId('enseignant_id')->constrained('enseignants');
            $table->primary(['case_tableau_id', 'enseignant_id']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('case_tableau_enseignant');
        Schema::dropIfExists('cases_tableau');
        Schema::dropIfExists('enseignements');
        Schema::dropIfExists('groupes');
        Schema::dropIfExists('promos');
        Schema::dropIfExists('enseignants');
        Schema::dropIfExists('annees');
    }
}
