<?php

namespace App\Services;

use App\Models\Enseignant;
use Illuminate\Support\Facades\Hash;

class EnseignantService
{
    public function generateUniqueCode(string $prenom, string $nom): string
    {
        $code = strtoupper(substr($prenom, 0, 1) . substr($nom, 0, 2));
        $originalCode = $code;
        $counter = 1;

        while (Enseignant::where('code', $code)->exists()) {
            if ($counter > strlen($nom)) {
                $code = strtoupper(substr($nom, 0, 2) . substr($prenom, 0, 1));
                break;
            }
            $code = strtoupper(substr($prenom, 0, 1) . substr($nom, 0, $counter + 1));
            $counter++;
        }

        return $code;
    }

    public function createEnseignant(array $data): Enseignant
    {
        $code = $this->generateUniqueCode($data['prenom'], $data['nom']);
        
        return Enseignant::create([
            'nom' => $data['nom'],
            'prenom' => $data['prenom'],
            'mail' => $data['mail'],
            'role_id' => $data['role_id'],
            'mot_de_passe' => Hash::make($data['password']),
            'actif' => $data['actif'],
            'code' => $code,
            'admin' => $data['admin'],
        ]);
    }

    public function updateEnseignant(Enseignant $enseignant, array $data): Enseignant
    {
        $updateData = [
            'nom' => $data['nom'],
            'prenom' => $data['prenom'],
            'mail' => $data['mail'],
            'role_id' => $data['role_id'],
            'actif' => $data['actif'],
            'admin' => $data['admin'],
        ];

        if (isset($data['password'])) {
            $updateData['mot_de_passe'] = Hash::make($data['password']);
        }

        $enseignant->update($updateData);
        return $enseignant->fresh();
    }

    public function updatePassword(Enseignant $enseignant, string $password): bool
    {
        return $enseignant->update([
            'mot_de_passe' => Hash::make($password)
        ]);
    }

    public function verifyCurrentPassword(Enseignant $enseignant, string $currentPassword): bool
    {
        return Hash::check($currentPassword, $enseignant->mot_de_passe);
    }
}
