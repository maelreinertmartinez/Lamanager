<?php

namespace Database\Factories;

use App\Models\Enseignement;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Promo;

class EnseignementFactory extends Factory
{
    protected $model = Enseignement::class;

    public function definition()
    {
        $promo = Promo::factory()->create();
        
        return [
            'nom' => 'R' . rand(1, 6) . '.' . str_pad(rand(1, 15), 2, '0', STR_PAD_LEFT),
            'promo_id' => $promo->id,
            'alternant' => $promo->nom === 'BUT 3',
            'nombre_heures_cm' => rand(10, 30),
            'nombre_heures_td' => rand(20, 40),
            'nombre_heures_tp' => rand(20, 40),
            'semestre' => rand(1, 2),
            'nombre_heures_projet' => rand(20, 40),
        ];
    }
}
