<?php

namespace Database\Seeders;

use App\Models\Promo;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class PromoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Annee
        $this->call(AnneeSeeder::class);

        // Create Promo
        Promo::factory()
            ->count(12)
            ->state(new Sequence(fn()=>
            [
                'annee_id'=>rand(1,6),
            ]))
            ->create();
    }
}
