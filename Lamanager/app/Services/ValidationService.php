<?php

namespace App\Services;

use App\Models\Enseignant;
use App\Models\Promo;

class ValidationService
{
    const MAX_HEURES_PAR_SEMAINE = 40;

    public function validateHeures($heures)
    {
        return is_numeric($heures) && $heures > 0;
    }

    public function validateEnseignantDisponibilite(Enseignant $enseignant, $semaine, $heuresAAjouter)
    {
        $heuresExistantes = $enseignant->cases()
            ->where('semaine', $semaine)
            ->sum('heures');

        return ($heuresExistantes + $heuresAAjouter) <= self::MAX_HEURES_PAR_SEMAINE;
    }

    public function validatePromoCapacite(Promo $promo, $nombreGroupes)
    {
        return is_numeric($nombreGroupes) && $nombreGroupes > 0;
    }

    public function validateEmail($email)
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
}
