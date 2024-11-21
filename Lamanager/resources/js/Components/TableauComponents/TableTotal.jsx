import React from 'react';

function TableTotal({ nbGroupe, nbCM, nbTD, nbTP, longueurSemaines, clickedCells }) {
    const categories = [
        { width: nbCM},
        { width: nbTD},
        { width: nbTP}
    ];

    return (
        <tbody>
            <tr>
                <td 
                    className="border border-black p-2" 
                    style={{ 
                        height: '70px',
                        width: `${100 / (nbGroupe + 2)}%` 
                    }}
                >
                    Total
                </td>
                {categories.map(({ width }, index) => (
                    <td
                        key={index}
                        className={`border border-black p-2`}
                        style={{ 
                            width: `${100 / (nbGroupe + 2) * width}%`
                        }}
                    >
                        {/* Ici vous pouvez ajouter la logique pour calculer le total par catégorie */}
                        {clickedCells[`${longueurSemaines}`]?.text}
                    </td>
                ))}
            </tr>
        </tbody>
    );
}

export default TableTotal;