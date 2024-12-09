import React from 'react';

export default function ProfilRightPart({ userData = {} }) {
    return (
        <div className="w-3/4 bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
                <div className="flex flex-col">
                    <label className="text-gray-600">Nom</label>
                    <input 
                        type="text" 
                        value={userData.nom || ''} 
                        readOnly 
                        className="bg-pink-50 p-2 rounded-md"
                    />
                </div>  
                <div className="flex flex-col">
                    <label className="text-gray-600">Prénom</label>
                    <input 
                        type="text" 
                        value={userData.prenom || ''} 
                        readOnly 
                        className="bg-pink-50 p-2 rounded-md"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-gray-600">Mail</label>
                    <input 
                        type="email" 
                        value={userData.email || ''} 
                        readOnly 
                        className="bg-pink-50 p-2 rounded-md"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-gray-600">Mot de passe</label>
                    <input 
                        type="password" 
                        value="************" 
                        readOnly 
                        className="bg-pink-50 p-2 rounded-md"
                    />
                </div>
                <div className="flex justify-end mt-6">
                    <button className="bg-pink-100 text-gray-700 px-4 py-2 rounded-md hover:bg-pink-200">
                        Gestion des comptes
                    </button>
                </div>
            </div>
        </div>
    );
} 