<?php

namespace Database\Factories;

use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Enseignant>
 */
class EnseignantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;


    public function definition(): array
    {
        return [
            'nom' => fake()->lastName(),
            'prenom' => fake()->firstName(),
            'code' => strtoupper(fake()->bothify("??")),
            'actif' => true,
            'mot_de_passe' => static::$password ??= Hash::make('ichbinschnapy'),
            'mail' => fake()->unique()->safeEmail(),
            'role_id' => Role::factory(),
        ];
    }
}
