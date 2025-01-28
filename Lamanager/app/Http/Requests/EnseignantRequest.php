<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class EnseignantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'mail' => 'required|string|email|max:255|unique:enseignants,mail,' . $this->enseignant?->id,
            'role_id' => 'required|integer|exists:roles,id',
            'password' => $this->isMethod('POST') ? ['required', 'string', 'confirmed', Password::defaults()] : ['sometimes', 'string', 'confirmed', Password::defaults()],
            'actif' => 'required|boolean',
            'admin' => 'required|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required' => 'Le nom est requis',
            'prenom.required' => 'Le prénom est requis',
            'mail.required' => 'L\'adresse email est requise',
            'mail.email' => 'L\'adresse email doit être valide',
            'mail.unique' => 'Cette adresse email est déjà utilisée',
            'role_id.required' => 'Le rôle est requis',
            'role_id.exists' => 'Le rôle sélectionné n\'existe pas',
            'password.required' => 'Le mot de passe est requis',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas',
        ];
    }
}
