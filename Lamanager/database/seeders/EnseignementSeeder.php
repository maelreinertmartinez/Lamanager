<?php

namespace Database\Seeders;

use App\Models\Enseignement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class EnseignementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {


        // Create Enseignant
        Enseignement::factory()
            ->count(30)
            ->state(new Sequence(fn()=>
            [
                'promo_id'=>rand(1,12),
            ]))
            ->create();
    }
}
