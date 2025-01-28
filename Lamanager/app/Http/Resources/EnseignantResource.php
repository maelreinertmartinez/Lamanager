<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EnseignantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'mail' => $this->mail,
            'code' => $this->code,
            'role_id' => $this->role_id,
            'role' => $this->when($this->relationLoaded('role'), function () {
                return [
                    'id' => $this->role->id,
                    'nom' => $this->role->nom,
                ];
            }),
            'actif' => $this->actif,
            'admin' => $this->admin,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
