<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Random\RandomException;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Groupe>
 */
class GroupeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $lettre = ['A','B'];
    protected $type = ['TD','TP'];

    /**
     * @throws RandomException
     */
    public function definition(): array
    {
        return [
            'nom' => 'G'. random_int(1,9). $this->lettre[array_rand($this->lettre)],
            'type' => $this->type[array_rand($this->type)],

        ];
    }
}
