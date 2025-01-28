<?php

namespace Database\Factories;

use App\Models\CaseTableau;
use App\Models\Enseignement;
use Illuminate\Database\Eloquent\Factories\Factory;

class CaseTableauFactory extends Factory
{
    protected $model = CaseTableau::class;

    public function definition()
    {
        return [
            'heures' => $this->faker->numberBetween(1, 40),
            'commentaire' => $this->faker->sentence(),
            'semaine' => $this->faker->numberBetween(1, 52),
            'enseignement_id' => Enseignement::factory()
        ];
    }
}
