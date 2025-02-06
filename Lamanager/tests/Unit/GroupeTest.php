<?php

namespace Tests\Unit;

use App\Models\Groupe;
use App\Models\Promo;
use App\Models\CaseTableau;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;

class GroupeTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_create_a_groupe()
    {
        $promo = Promo::factory()->create();

        Groupe::create([
            'promo_id' => $promo->id,
            'nom' => 'Test Groupe',
            'type' => 'TD'
        ]);

        $this->assertDatabaseHas('groupes', [
            'nom' => 'Test Groupe',
            'type' => 'TD'
        ]);
    }

    #[Test]
    public function it_belongs_to_a_promo()
    {
        $promo = Promo::factory()->create();
        $groupe = Groupe::factory()->for($promo)->create();

        $this->assertInstanceOf(Promo::class, $groupe->promo);
        $this->assertEquals($promo->id, $groupe->promo->id);
    }

    #[Test]
    public function it_can_have_many_sub_groupes()
    {
        $promo = Promo::factory()->create();
        $parentGroupe = Groupe::factory()->for($promo)->create();
        Groupe::factory()->for($promo)->create(['groupe_id' => $parentGroupe->id]);
        Groupe::factory()->for($promo)->create(['groupe_id' => $parentGroupe->id]);

        $this->assertCount(2, $parentGroupe->groupes);
        $this->assertInstanceOf(Groupe::class, $parentGroupe->groupes->first());
    }

    #[Test]
    public function it_can_have_many_cases()
    {
        $promo = Promo::factory()->create();
        $groupe = Groupe::factory()->for($promo)->create();
        CaseTableau::factory()->create(['groupe_id' => $groupe->id]);
        CaseTableau::factory()->create(['groupe_id' => $groupe->id]);

        $this->assertCount(2, $groupe->cases);
        $this->assertInstanceOf(CaseTableau::class, $groupe->cases->first());
    }
}
