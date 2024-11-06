<?php

namespace Database\Seeders;

use App\Models\Semaine;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class SemaineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */

    public function run()
    {
        $semaines = [
            'S01',
            'S02',
            'S03',
            'S04',
            'S05',
            'S06',
            'S07',
            'S08',
            'S09',
            'S10',
            'S11',
            'S12',
            'S13',
            'S14',
            'S15',
            'S16',
            'S17',
            'S18',
            'S19',
            'S20',
            'S21',
            'S22',
            'S23',
            'S24',
            'S25',
            'S26',
            'S27',
            'S28',
            'S29',
            'S30',
            'S31',
            'S32',
            'S33',
            'S34',
            'S35',
            'S36',
            'S37',
            'S38',
            'S39',
            'S40',
            'S41',
            'S42',
            'S43',
            'S44',
            'S45',
            'S46',
            'S47',
            'S48',
            'S49',
            'S50',
            'S51',
            'S52',
        ];

        foreach ($semaines as $semaine) {
            Semaine::firstOrCreate(['numero' => $semaine]);
        }
    }
}
