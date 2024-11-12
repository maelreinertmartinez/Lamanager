<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Random\RandomException;
use App\Models\Groupe;

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
    


    /**
     * @throws RandomException
     */
    public function definition(): array
    {

        $lettre = ['A','B'];
        $liste_type = ['TD','TP'];
        $type = $liste_type[array_rand($liste_type)];

        return [
            'type' => $type,
            'nom' => function(array $attributes) use ($type,$lettre){
                if ($type=="TP"){
                    return 'G'. random_int(1,9). $lettre[array_rand($lettre)];
                }
                if ($type=="TD"){
                    return 'G'. random_int(1,9);
                }
                
            }

        ];
    }
}
