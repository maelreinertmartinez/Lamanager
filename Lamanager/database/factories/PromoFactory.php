<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Annee;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Promo>
 */
class PromoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nom' => 'BUT ' . $this->faker->numberBetween(1, 3),
            'nombre_td' => $this->faker->numberBetween(1, 4),
            'nombre_tp' => $this->faker->numberBetween(2, 8),
            'alternant' => $this->faker->boolean,
            'nb_etudiants' => $this->faker->numberBetween(40, 150),
            'annee_id' => Annee::factory(),
        ];
    }
}
