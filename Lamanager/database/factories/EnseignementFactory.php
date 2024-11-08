<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Promo;

class EnseignementFactory extends Factory
{
    public function definition(): array
    {
        // Détermine les numéros R possibles selon le nom de la promo
        $but_level = function($promo_nom) {
            return match($promo_nom) {
                'BUT1' => [1, 2],    // BUT1 -> R1 ou R2
                'BUT2' => [3, 4],    // BUT2 -> R3 ou R4
                'BUT3' => [5, 6],    // BUT3 -> R5 ou R6
                default => [1, 2],    // Par défaut BUT1
            };
        };

        return [
            'nom' => function (array $attributes) use ($but_level) {
                $promo = Promo::find($attributes['promo_id']);
                $r_numbers = $but_level($promo->nom);
                $r_number = $r_numbers[array_rand($r_numbers)];
                return 'R' . $r_number . '.' . str_pad(rand(1, 15), 2, '0', STR_PAD_LEFT);
            },
            'alternant' => function (array $attributes) {
                $promo = Promo::find($attributes['promo_id']);
                return $promo->nom === 'BUT3';
            },
            'nombre_heures_cm' => rand(10, 30),
            'nombre_heures_td' => rand(20, 40),
            'nombre_heures_tp' => rand(20, 40),
            'semestre' => rand(1, 2),
            'nombre_heures_max' => rand(50, 110),
        ];
    }
}