<?php

namespace Database\Factories;

use App\Models\Semaine;
use App\Models\Annee;
use Illuminate\Database\Eloquent\Factories\Factory;

class SemaineFactory extends Factory
{
    protected $model = Semaine::class;

    public function definition(): array
    {
        return [
            'annee_id' => Annee::factory(),
            'numero' => $this->faker->numberBetween(1, 52),
            'date_debut' => $this->faker->dateTimeBetween('2024-01-01', '2024-12-31'),
        ];
    }
}
