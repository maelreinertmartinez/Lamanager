import React, { useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function ProfilLeftPart({ userName = 'Utilisateur' }) {
    return (
        <div className="flex flex-col items-center p-4">
            <div className="w-32 h-32 bg-purple-700 rounded-full flex items-center justify-center mb-4">
                <User className="w-20 h-20 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-6">{userName}</h2>
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                <LogOut className="w-6 h-6" />
                <Link
                href={route('logout')}
                method="post"
                as="button"
                
                >
                Déconnexion
                </Link>
            </button>
        </div>
    );
} 