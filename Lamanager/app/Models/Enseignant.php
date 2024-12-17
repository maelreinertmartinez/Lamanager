<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class Enseignant extends Authenticatable
{
    use HasFactory, HasApiTokens;

    protected $fillable = [
        'role_id',
        'code',
        'actif',
        'mot_de_passe',
        'nom',
        'prenom',
        'mail',
        'admin'
    ];

    protected $hidden = [
        'mot_de_passe',
    ];

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function cases()
    {
        return $this->hasMany(CaseTableau::class);
    }

    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }

    public function getEmailAttribute()
    {
        return $this->mail;
    }

    public function setEmailAttribute($value)
    {
        $this->attributes['mail'] = $value;
    }

    public function setPasswordAttribute($value)
    {
        $this->attributes['mot_de_passe'] = $value;
    }

    public function alertes()
    {
        return $this->hasMany(Alerte::class);
    }
}
