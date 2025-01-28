<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\CaseTableau;
use App\Models\Enseignant;
use App\Models\Enseignement;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CaseTableauTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_case_tableau()
    {
        $case = CaseTableau::factory()->create([
            'heures' => 20,
            'commentaire' => 'Test commentaire',
            'semaine' => 1
        ]);

        $this->assertDatabaseHas('cases_tableau', [
            'heures' => 20,
            'commentaire' => 'Test commentaire',
            'semaine' => 1
        ]);
    }

    public function test_case_belongs_to_enseignement()
    {
        $enseignement = Enseignement::factory()->create();
        $case = CaseTableau::factory()->create([
            'enseignement_id' => $enseignement->id
        ]);

        $this->assertEquals($enseignement->id, $case->enseignement->id);
    }

    public function test_case_has_enseignants()
    {
        $case = CaseTableau::factory()->create();
        $enseignant = Enseignant::factory()->create();

        $case->enseignants()->attach($enseignant->id);

        $this->assertTrue($case->enseignants->contains($enseignant));
        $this->assertEquals(1, $case->enseignants->count());
    }

    public function test_case_validation_rules()
    {
        $case = new CaseTableau();
        
        $this->assertTrue($case->validateHeures(20));
        $this->assertFalse($case->validateHeures(-1));
        $this->assertFalse($case->validateHeures(0));
    }
}
