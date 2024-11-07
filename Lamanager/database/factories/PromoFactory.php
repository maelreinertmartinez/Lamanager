<?php

namespace Database\Factories;

use App\Models\Annee;
use Illuminate\Database\Eloquent\Factories\Factory;

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
    protected $promo=[
        'BUT1',
        'BUT2',
        'BUT3',
    ];
    protected $nbr_td = [2, 3];
    protected $nbr_tp = [4, 6];
    public function definition(): array
    {

        return [
            'nom'=>$this->promo[array_rand($this->promo)],
            'nombre_td'=>$this->nbr_td[array_rand($this->nbr_td)],
            'nombre_tp'=>$this->nbr_tp[array_rand($this->nbr_tp)],
            'alternant'=>true,
            'annee_id'=>Annee::factory(),
        ];
    }
}
