<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CaseTableau extends Model
{
    use HasFactory;

    protected $table = 'cases_tableau';

    protected $fillable = [
        'heures',
        'commentaire',
        'semaine',
        'enseignement_id'
    ];

    public function enseignement(): BelongsTo
    {
        return $this->belongsTo(Enseignement::class);
    }

    public function enseignants(): BelongsToMany
    {
        return $this->belongsToMany(Enseignant::class);
    }

    public function validateHeures($heures = null): bool
    {
        $heures = $heures ?? $this->heures;
        return $heures > 0 && $heures <= 40;
    }
}
