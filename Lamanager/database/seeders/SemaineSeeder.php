<?php

namespace Database\Seeders;

use App\Models\Semaine;
use App\Models\Annee;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SemaineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $annee = Annee::first();
        if (!$annee) {
            $annee = Annee::factory()->create();
        }

        $startDate = Carbon::create(2024, 1, 1);
        
        $semaines = [];
        for ($i = 1; $i <= 52; $i++) {
            $weekNumber = str_pad($i, 2, '0', STR_PAD_LEFT);
            $semaines[] = [
                'numero' => 'S' . $weekNumber,
                'date_debut' => $startDate->copy()->addWeeks($i - 1),
                'annee_id' => $annee->id
            ];
        }

        foreach ($semaines as $semaine) {
            Semaine::firstOrCreate([
                'numero' => $semaine['numero']
            ], [
                'date_debut' => $semaine['date_debut'],
                'annee_id' => $semaine['annee_id']
            ]);
        }
    }
}
