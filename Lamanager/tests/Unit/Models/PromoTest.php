<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Promo;
use App\Models\Groupe;
use App\Models\Annee;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PromoTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_promo()
    {
        $annee = Annee::factory()->create();
        $promo = Promo::factory()->create([
            'nom' => 'BUT1 Info',
            'annee_id' => $annee->id,
            'nb_etudiants' => 120
        ]);

        $this->assertDatabaseHas('promos', [
            'nom' => 'BUT1 Info',
            'nb_etudiants' => 120
        ]);
    }

    public function test_promo_belongs_to_annee()
    {
        $annee = Annee::factory()->create();
        $promo = Promo::factory()->create([
            'annee_id' => $annee->id
        ]);

        $this->assertEquals($annee->id, $promo->annee->id);
    }

    public function test_promo_has_groupes()
    {
        $promo = Promo::factory()->create();
        $groupe = Groupe::factory()->create([
            'promo_id' => $promo->id
        ]);

        $this->assertTrue($promo->groupes->contains($groupe));
        $this->assertEquals(1, $promo->groupes->count());
    }

    public function test_calculate_total_groupes()
    {
        $promo = Promo::factory()->create();
        Groupe::factory()->count(3)->create([
            'promo_id' => $promo->id
        ]);

        $this->assertEquals(3, $promo->groupes()->count());
    }

    public function test_promo_validation()
    {
        $promo = new Promo();
        
        $this->assertTrue($promo->validateNbEtudiants(120));
        $this->assertFalse($promo->validateNbEtudiants(-1));
        $this->assertFalse($promo->validateNbEtudiants(0));
    }
}
