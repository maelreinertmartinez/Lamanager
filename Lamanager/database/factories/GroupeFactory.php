<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Groupe;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Groupe>
 */
class GroupeFactory extends Factory
{
    protected $td_liste = [
        'TD1',
        'TD2',
        'TD3',
        'TD4',
    ];

    protected $tp_liste = [
        'TP1',
        'TP2',
        'TP3',
        'TP4',
        'TP5',
        'TP6',
        'TP7',
        'TP8',
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = $this->faker->randomElement(['TD', 'TP']);
        
        return [
            'nom' => $type === 'TD' ? array_pop($this->td_liste) : array_pop($this->tp_liste),
            'type' => $type,
            'promo_id' => \App\Models\Promo::factory(),
        ];
    }
}
