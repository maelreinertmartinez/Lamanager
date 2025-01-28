<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\ValidationService;
use App\Models\Enseignant;
use App\Models\CaseTableau;
use App\Models\Promo;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ValidationServiceTest extends TestCase
{
    use RefreshDatabase;

    private ValidationService $validator;

    protected function setUp(): void
    {
        parent::setUp();
        $this->validator = new ValidationService();
    }

    public function test_validate_heures_input()
    {
        $this->assertTrue($this->validator->validateHeures(10));
        $this->assertTrue($this->validator->validateHeures(1.5));
        $this->assertFalse($this->validator->validateHeures(-1));
        $this->assertFalse($this->validator->validateHeures(0));
        $this->assertFalse($this->validator->validateHeures('abc'));
    }

    public function test_validate_enseignant_disponibilite()
    {
        $enseignant = Enseignant::factory()->create();
        $case1 = CaseTableau::factory()->create([
            'semaine' => 1,
            'heures' => 20
        ]);
        
        $this->assertTrue($this->validator->validateEnseignantDisponibilite($enseignant, 1, 10));
        
        $enseignant->cases()->attach($case1->id);
        
        // L'enseignant a déjà 20h, on ne peut pas ajouter 30h de plus
        $this->assertFalse($this->validator->validateEnseignantDisponibilite($enseignant, 1, 30));
    }

    public function test_validate_promo_capacite()
    {
        $promo = Promo::factory()->create([
            'nb_etudiants' => 100
        ]);

        $this->assertTrue($this->validator->validatePromoCapacite($promo, 3));
        $this->assertFalse($this->validator->validatePromoCapacite($promo, 0));
        $this->assertFalse($this->validator->validatePromoCapacite($promo, -1));
    }

    public function test_validate_email_format()
    {
        $this->assertTrue($this->validator->validateEmail('test@example.com'));
        $this->assertTrue($this->validator->validateEmail('user.name@domain.fr'));
        $this->assertFalse($this->validator->validateEmail('invalid.email'));
        $this->assertFalse($this->validator->validateEmail('@domain.com'));
    }
}
