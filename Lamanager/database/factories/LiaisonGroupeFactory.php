<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LiaisonGroupe>
 */
class LiaisonGroupeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $td_id = 19;
    protected $tp_id = 61;

    public function definition(): array
    {

        return [
            'groupe_tp_id' => function(array $attributes) {
                $nbr = $this->tp_id;
                $this->tp_id++;

                return $nbr;
            },
            'groupe_td_id' => function(array $attributes) {
                $nbr = $this->td_id;
                if ($this->tp_id % 2 == 1){
                    $this->td_id++;
                }
                return $nbr;
                },

        ];
    }
}
