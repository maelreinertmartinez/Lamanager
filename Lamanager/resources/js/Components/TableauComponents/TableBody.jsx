import React from 'react';
import { handleCellClick, getColorClass } from '../../utils';

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
    setClickedCells 
}) {
    return (
        <tbody>
            {semaines.map((semaine, rowIndex) => (
                <tr key={semaine}>
                    <td
                        className="border border-black p-2"
                        style={{ height: '70px', cursor: 'pointer' }}
                        onClick={() => handleCellClick(
                            rowIndex, 
                            0, 
                            null, 
                            enseignantId, 
                            enseignement.id, 
                            null, 
                            true, 
                            nbGroupe, 
                            groupesID, 
                            semainesID, 
                            enseignantCode, 
                            heures, 
                            minutes, 
                            setClickedCells
                        )}
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
                            onClick={() => handleCellClick(
                                rowIndex, 
                                index, 
                                semainesID[rowIndex], 
                                enseignantId, 
                                enseignement.id, 
                                groupesID[index], 
                                false, 
                                nbGroupe, 
                                groupesID, 
                                semainesID, 
                                enseignantCode, 
                                heures,
                                minutes, 
                                setClickedCells
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