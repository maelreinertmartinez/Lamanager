<?php

namespace Database\Seeders;

use App\Models\Groupe;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class GroupeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Role
        $this->call(PromoSeeder::class);

        // Create Enseignant
        Groupe::factory()
            ->count(60)
            ->state(new Sequence(fn()=>
            [
                'promo_id'=>rand(1,12),
            ]))
            ->create();
    }
}
