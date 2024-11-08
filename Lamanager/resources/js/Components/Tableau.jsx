import React from "react";

function Tableau({ selectedEnseignements = [], onRemoveEnseignement }) {
    if (!selectedEnseignements || selectedEnseignements.length === 0) {
        return <h1 className="Select-enseignement">Veuillez selectionner un enseignement</h1>;
    }

    return (
        <div className="Tableau">
            <div className="flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                    {selectedEnseignements.map((enseignement) => enseignement && (
                        <div 
                            key={enseignement.id}
                            className="flex items-center bg-gray-100 rounded-lg px-3 py-1"
                        >
                            <span className="mr-2">{enseignement.nom || 'Sans nom'}</span>
                            <button
                                onClick={() => onRemoveEnseignement(enseignement.id)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
                {selectedEnseignements.map((enseignement) => enseignement && (
                    <div key={enseignement.id} className="mb-4">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2">CM</th>
                                    <th className="border border-gray-300 p-2">TD</th>
                                    <th className="border border-gray-300 p-2">TP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'Total'].map((row) => (
                                    <tr key={row}>
                                        <td className="border border-gray-300 p-2"></td>
                                        <td className="border border-gray-300 p-2"></td>
                                        <td className="border border-gray-300 p-2"></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Tableau;