<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class EnseignementFactory extends Factory
{
    public function definition(): array
    {
        // Génère un promo_id aléatoire entre 1 et 18 (6 années × 3 BUT)
        $promo_id = rand(1, 18);
        
        // Détermine le niveau de BUT en fonction du promo_id
        $but_level = (($promo_id - 1) % 3) + 1; // 1, 2, ou 3
        
        // Détermine le chiffre R en fonction du niveau BUT
        $r_number = match($but_level) {
            1 => rand(1, 2),    // BUT1 -> R1 ou R2
            2 => rand(3, 4),    // BUT2 -> R3 ou R4
            3 => rand(5, 6),    // BUT3 -> R5 ou R6
        };

        return [
            'nom' => 'R' . $r_number . '.' . str_pad(rand(1, 15), 2, '0', STR_PAD_LEFT),
            'promo_id' => $promo_id,
            'alternant' => $but_level === 3, // true seulement pour BUT3
            'nombre_heures_cm' => rand(10, 30),
            'nombre_heures_td' => rand(20, 40),
            'nombre_heures_tp' => rand(20, 40),
            'semestre' => rand(1, 2),
            'nombre_heures_max' => rand(50, 110),
        ];
    }
}