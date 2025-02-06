<?php

namespace Database\Seeders;

use App\Models\LiaisonGroupe;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            //RoleSeeder::class,
            AnneeSeeder::class,
            EnseignantSeeder::class,
            SemaineSeeder::class,
            EnseignementSeeder::class,
            GroupeSeeder::class,
            AlerteSeeder::class,
        ]);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
        LiaisonGroupe::factory()
            ->count(84)
            ->create();
    }
}
