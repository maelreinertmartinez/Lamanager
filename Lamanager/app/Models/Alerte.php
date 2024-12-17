<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Alerte extends Model
{
    use HasFactory;

    protected $fillable = [
        'enseignant_id',
        'nom',
        'niveau',
        'heure_min',
        'heure_max',
        'couleur',
    ];
    public function enseignemant(): BelongsTo
    {
        return $this->belongsTo(Enseignant::class, 'enseignant_id');
    }


}
