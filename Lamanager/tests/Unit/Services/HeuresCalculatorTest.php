<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\HeuresCalculator;
use App\Models\Enseignant;
use App\Models\CaseTableau;
use Illuminate\Foundation\Testing\RefreshDatabase;

class HeuresCalculatorTest extends TestCase
{
    use RefreshDatabase;

    private HeuresCalculator $calculator;

    protected function setUp(): void
    {
        parent::setUp();
        $this->calculator = new HeuresCalculator();
    }

    public function test_calculate_total_heures_enseignant()
    {
        $enseignant = Enseignant::factory()->create();
        $cases = CaseTableau::factory()->count(3)->create([
            'heures' => 10
        ]);

        foreach ($cases as $case) {
            $enseignant->cases()->attach($case->id);
        }

        $total = $this->calculator->calculateTotalHeuresEnseignant($enseignant);
        $this->assertEquals(30, $total);
    }

    public function test_calculate_heures_by_semaine()
    {
        $enseignant = Enseignant::factory()->create();
        
        // Créer des cases pour différentes semaines
        $case1 = CaseTableau::factory()->create(['heures' => 10, 'semaine' => 1]);
        $case2 = CaseTableau::factory()->create(['heures' => 15, 'semaine' => 1]);
        $case3 = CaseTableau::factory()->create(['heures' => 20, 'semaine' => 2]);

        $enseignant->cases()->attach([$case1->id, $case2->id, $case3->id]);

        $heuresBySemaine = $this->calculator->calculateHeuresBySemaine($enseignant);
        
        $this->assertEquals(25, $heuresBySemaine[1]);
        $this->assertEquals(20, $heuresBySemaine[2]);
    }

    public function test_calculate_total_heures_enseignement()
    {
        $cases = CaseTableau::factory()->count(3)->create([
            'heures' => 10,
            'enseignement_id' => 1
        ]);

        $total = $this->calculator->calculateTotalHeuresEnseignement(1);
        $this->assertEquals(30, $total);
    }

    public function test_calculate_pourcentage_realisation()
    {
        $enseignant = Enseignant::factory()->create();
        $totalPrevu = 100;
        $cases = CaseTableau::factory()->count(2)->create([
            'heures' => 25
        ]);

        foreach ($cases as $case) {
            $enseignant->cases()->attach($case->id);
        }

        $pourcentage = $this->calculator->calculatePourcentageRealisation($enseignant, $totalPrevu);
        $this->assertEquals(50, $pourcentage);
    }
}
