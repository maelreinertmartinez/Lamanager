<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Alerte>
 */
class AlerteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nom' => "alerte",
            'niveau' => 0,
            'heure_min' => 0, // Par défaut, ces valeurs seront remplacées
            'heure_max' => 0, // dans le Seeder pour chaque alerte
            'couleur' => "000000",

        ];
    }
}
