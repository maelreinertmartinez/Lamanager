import React, { useState } from 'react';
import { handleCellClick } from '../../utils';
import { getColorClass } from '../../utils';

function TableBody({ 
    semaines,
    semainesID,
    nbGroupe,
    nbCM,
    nbTD,
    clickedCells,
    enseignantId,
    enseignement,
    groupesID,
    enseignantCode,
    heures,
    minutes,
    setClickedCells,
    onCellClick 
}) {
    const handleClick = (rowIndex, colIndex, semaineId, groupeId, isSemaineColumn) => {
        if (!enseignantId) {
            onCellClick();
            return;
        }
        
        handleCellClick(
            rowIndex, 
            colIndex, 
            semaineId, 
            enseignantId, 
            enseignement.id, 
            groupeId, 
            isSemaineColumn, 
            nbGroupe, 
            groupesID, 
            semainesID, 
            enseignantCode, 
            heures,
            minutes, 
            setClickedCells
        );
    };

    return (
        <tbody>
            {semaines.map((semaine, rowIndex) => (
                <tr key={semaine}>
                    <td
                        className="border border-black p-2"
                        style={{ height: '70px', cursor: 'pointer' }}
                        onClick={() => handleClick(rowIndex, 0, null, null, true)}
                    >
                        {semaine}
                    </td>
                    {Array.from({ length: nbGroupe }, (_, index) => (
                        <td
                            key={index}
                            className={`border border-black p-2 ${
                                clickedCells[`${rowIndex}-${index}`]?.clicked 
                                    ? getColorClass(index, nbCM, nbTD) 
                                    : ''
                            }`}
                            style={{ cursor: 'pointer', width: `${100 / (nbGroupe+2)}%` }}
                            onClick={() => handleClick(
                                rowIndex,
                                index,
                                semainesID[rowIndex],
                                groupesID[index],
                                false
                            )}
                        >
                            {clickedCells[`${rowIndex}-${index}`]?.text && (
                                <h3>{clickedCells[`${rowIndex}-${index}`].text}</h3>
                            )}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
}

export default TableBody;