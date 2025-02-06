<?php

namespace Database\Factories;

use App\Models\CaseTableau;
use App\Models\Groupe;
use App\Models\Enseignant;
use App\Models\Enseignement;
use App\Models\Semaine;
use Illuminate\Database\Eloquent\Factories\Factory;

class CaseTableauFactory extends Factory
{
    protected $model = CaseTableau::class;

    public function definition(): array
    {
        return [
            'groupe_id' => Groupe::factory(),
            'enseignant_id' => Enseignant::factory(),
            'enseignement_id' => Enseignement::factory(),
            'semaine_id' => Semaine::factory(),
            'jour' => $this->faker->numberBetween(1, 5),
            'creneau' => $this->faker->numberBetween(1, 8),
            'nombre_heure' => $this->faker->randomElement([1, 1.5, 2, 3, 4]),
        ];
    }
}
