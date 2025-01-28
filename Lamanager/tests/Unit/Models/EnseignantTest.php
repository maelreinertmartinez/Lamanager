<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Enseignant;
use App\Models\Enseignement;
use App\Models\CaseTableau;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EnseignantTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_enseignant()
    {
        $enseignant = Enseignant::factory()->create([
            'nom' => 'Dupont',
            'prenom' => 'Jean',
            'email' => 'jean.dupont@example.com',
            'statut' => 'titulaire'
        ]);

        $this->assertDatabaseHas('enseignants', [
            'nom' => 'Dupont',
            'prenom' => 'Jean',
            'email' => 'jean.dupont@example.com'
        ]);
    }

    public function test_enseignant_has_enseignements()
    {
        $enseignant = Enseignant::factory()->create();
        $enseignement = Enseignement::factory()->create();

        $enseignant->enseignements()->attach($enseignement->id);

        $this->assertTrue($enseignant->enseignements->contains($enseignement));
        $this->assertEquals(1, $enseignant->enseignements->count());
    }

    public function test_enseignant_has_cases()
    {
        $enseignant = Enseignant::factory()->create();
        $case = CaseTableau::factory()->create();

        $enseignant->cases()->attach($case->id);

        $this->assertTrue($enseignant->cases->contains($case));
        $this->assertEquals(1, $enseignant->cases->count());
    }

    public function test_calculate_total_heures()
    {
        $enseignant = Enseignant::factory()->create();
        $case1 = CaseTableau::factory()->create(['heures' => 10]);
        $case2 = CaseTableau::factory()->create(['heures' => 15]);

        $enseignant->cases()->attach([$case1->id, $case2->id]);

        $this->assertEquals(25, $enseignant->totalHeures());
    }
}
