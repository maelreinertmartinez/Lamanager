import React, { useState, useEffect } from "react";

function ImportPopup({ onClose }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [listeRecherche, setListeRecherche] = useState([]); 
    const [listeHeures, setListeHeures] = useState([]);
    const [isAlternance, setIsAlternance] = useState(false);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    useEffect(() => {
        const handleImport = async () => {
            if (!selectedFile) {
                alert("Please select a CSV file first.");
                return;
            }

            const reader = new FileReader();

            reader.onload = (event) => {
                const csvContent = event.target.result;
                console.log("CSV Content:", csvContent);

                const rows = csvContent.split('\n').map(row => row.split(','));
                console.log("Parsed CSV:", rows);

                let compteur = 18;
                let isAlternanceFound = false;

                let liste_recherche = [];
                let liste_heures = [];

                while (rows[compteur] && rows[compteur][1] !== "") {
                    let liste_temp = [];
                    liste_recherche.push(rows[compteur][1]);

                    let cm = parseFloat(rows[compteur][4] || "0");
                    let td = parseFloat(rows[compteur][5] || "0");
                    let tp = parseFloat(rows[compteur][6] || "0");
                    let total = parseFloat(rows[compteur][8]);

                    let heures_projet = total - (cm + td + tp);

                    liste_temp.push(cm);
                    liste_temp.push(td);
                    liste_temp.push(tp);
                    liste_temp.push(heures_projet);

                    if (rows[9][7] === "Alternance") {
                        isAlternanceFound = true;
                        liste_temp.push(parseFloat(rows[compteur][10] || cm));
                        liste_temp.push(parseFloat(rows[compteur][11] || td));
                        liste_temp.push(parseFloat(rows[compteur][12] || tp));
                        liste_temp.push(parseFloat(rows[compteur][14]));
                    }

                    liste_heures.push(liste_temp);
                    compteur++;
                }

                console.log("Liste des heures : ", liste_heures);
                console.log(liste_recherche);
                setIsAlternance(isAlternanceFound);
                setListeRecherche(liste_recherche); 
                setListeHeures(liste_heures);
            };

            reader.readAsText(selectedFile);
        }
        handleImport();
    }, [selectedFile]);

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <input type="file" accept=".csv" onChange={handleFileChange} />
                
                
                
                <div className="tableau-import">
                {listeRecherche.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th rowSpan={2} className="border border-black p-2">Ressources / SAE</th> 
                                <th colSpan={4} className="border border-black p-2">Formation initiale</th> 
                                {isAlternance && <th colSpan={4} className="border border-black p-2">Alternance</th>}
                            </tr>
                            <tr>
                                <th className="border border-black p-2">CM</th>
                                <th className="border border-black p-2">TD</th>
                                <th className="border border-black p-2">TP</th>
                                <th className="border border-black p-2">Heures projet</th>
                                {isAlternance && <th className="border border-black p-2">CM</th>} 
                                {isAlternance && <th className="border border-black p-2">TD</th>} 
                                {isAlternance && <th className="border border-black p-2">TP</th>} 
                                {isAlternance && <th className="border border-black p-2">Heures projet</th>}
                            </tr>                            
                        </thead>

                        <tbody className="border border-black p-2">
                            {listeRecherche.map((item, index) => (
                                <tr key={index}>
                                    <td className="border border-black p-2">{item}</td>
                                    <td className="border border-black p-2">{listeHeures[index] && listeHeures[index][0]}</td>
                                    <td className="border border-black p-2">{listeHeures[index] && listeHeures[index][1]}</td>
                                    <td className="border border-black p-2">{listeHeures[index] && listeHeures[index][2]}</td>
                                    <td className="border border-black p-2">{listeHeures[index] && listeHeures[index][3]}</td>
                                    {isAlternance && <td className="border border-black p-2">{listeHeures[index] && listeHeures[index][4]}</td>} 
                                    {isAlternance && <td className="border border-black p-2">{listeHeures[index] && listeHeures[index][5]}</td>} 
                                    {isAlternance && <td className="border border-black p-2">{listeHeures[index] && listeHeures[index][6]}</td>} 
                                    {isAlternance && <td className="border border-black p-2">{listeHeures[index] && listeHeures[index][7]}</td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                </div>  
                <div className="button-container">
                    <button onClick={() => `Liste Recherche: ${listeRecherche}`}>Afficher M3C</button>
                </div>       
            </div>
        </div>
    );
}

export default ImportPopup;
