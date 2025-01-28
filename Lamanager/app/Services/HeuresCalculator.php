<?php

namespace App\Services;

use App\Models\Enseignant;

class HeuresCalculator
{
    public function calculateTotalHeuresEnseignant(Enseignant $enseignant)
    {
        return $enseignant->cases->sum('heures');
    }

    public function calculateHeuresBySemaine(Enseignant $enseignant)
    {
        return $enseignant->cases->groupBy('semaine')
            ->map(function ($cases) {
                return $cases->sum('heures');
            });
    }

    public function calculateTotalHeuresEnseignement($enseignementId)
    {
        return \App\Models\CaseTableau::where('enseignement_id', $enseignementId)
            ->sum('heures');
    }

    public function calculatePourcentageRealisation(Enseignant $enseignant, $totalPrevu)
    {
        if ($totalPrevu <= 0) {
            return 0;
        }

        $totalRealise = $this->calculateTotalHeuresEnseignant($enseignant);
        return ($totalRealise / $totalPrevu) * 100;
    }
}
