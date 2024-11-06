<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Random\RandomException;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Enseignement>
 */
class EnseignementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     * @throws RandomException
     */
    public function definition(): array
    {
        return [
            'nom' => 'R' . random_int(1,6) . '.' . random_int(1,15),
            'alternant'=>true,
            'nombre_heures_cm'=>random_int(10,30),
            'nombre_heures_td'=>random_int(20,40),
            'nombre_heures_tp'=>random_int(20,40),
            'semestre' => random_int(1,2),
            'nombre_heures_max'=>random_int(50,110),
        ];
    }
}
