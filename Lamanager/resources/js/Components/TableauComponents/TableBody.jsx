import React, { useState, useEffect } from 'react';
import { handleCellClick, addCellToDatabase, deleteCellFromDatabase } from '../../utils';
import { getColorClass } from '../../utils';
import ContextMenu from './ContextMenu';
import DuplicatePopup from './DuplicatePopup';

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
    onCellClick,
    showIcons
}) {
    const [contextMenu, setContextMenu] = useState(null);
    const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);
    const [duplicateOption, setDuplicateOption] = useState('pairs');
    const [customWeeks, setCustomWeeks] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleClickOutside = () => {
            setContextMenu(null);
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleClick = (rowIndex, colIndex, semaineId, groupeId, isSemaineColumn) => {
        if (contextMenu) {
            return;
        }

        if (!enseignantId) {
            onCellClick();
            return;
        }

        if (isSemaineColumn) {
            if (showIcons) {
                // Mode sélection activé
                setClickedCells((prev) => {
                    const updatedCells = { ...prev };
                    const semaineKey = `semaine-${rowIndex}`;
                    const isSelected = !updatedCells[semaineKey]?.selected;

                    updatedCells[semaineKey] = {
                        ...updatedCells[semaineKey],
                        selected: isSelected,
                    };

                    for (let i = 0; i < nbGroupe; i++) {
                        const cellKey = `${rowIndex}-${i}`;
                        if (updatedCells[cellKey]?.text) {
                            updatedCells[cellKey] = {
                                ...updatedCells[cellKey],
                                selected: isSelected,
                            };
                        }
                    }

                    return updatedCells;
                });
            } else {
                // Mode sélection désactivé
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
            }
            return;
        }

        if (!showIcons) {
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
        } else if (clickedCells[`${rowIndex}-${colIndex}`]?.text) {
            setClickedCells((prev) => {
                const updatedCells = { ...prev };
                const key = `${rowIndex}-${colIndex}`;
                updatedCells[key] = {
                    ...updatedCells[key],
                    selected: !updatedCells[key]?.selected,
                };

                const allSelected = Array.from({ length: nbGroupe }, (_, i) => `${rowIndex}-${i}`)
                    .filter(cellKey => updatedCells[cellKey]?.text)
                    .every(cellKey => updatedCells[cellKey]?.selected);

                updatedCells[`semaine-${rowIndex}`] = {
                    ...updatedCells[`semaine-${rowIndex}`],
                    selected: allSelected,
                };

                return updatedCells;
            });
        }
    };

    const handleContextMenu = (event, rowIndex, colIndex) => {
        event.preventDefault();
        event.stopPropagation();
        if (showIcons && clickedCells[`${rowIndex}-${colIndex}`]?.text) {
            setContextMenu({
                mouseX: event.clientX,
                mouseY: event.clientY,
                rowIndex,
                colIndex
            });
        }
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    const handleDuplicate = async () => {
        setShowDuplicatePopup(true);
    };

    const parseWeeks = (weeksString) => {
        const weeks = [];
        const ranges = weeksString.split(',');
        ranges.forEach(range => {
            if (range.includes('-')) {
                const [start, end] = range.split('-').map(Number);
                for (let i = start; i <= end; i++) {
                    weeks.push(i);
                }
            } else {
                weeks.push(Number(range));
            }
        });
        return weeks;
    };

    const handleDuplicateConfirm = async () => {
        setIsLoading(true);
        const selectedCells = Object.keys(clickedCells).filter(key => clickedCells[key]?.selected && !key.startsWith('semaine-'));
        const selectedRows = [...new Set(selectedCells.map(key => key.split('-')[0]))];

        let weeksToDuplicate = [];

        if (selectedRows.length === 1) {
            if (duplicateOption === 'pairs') {
                weeksToDuplicate = semainesID.filter((_, index) => index % 2 === 0);
            } else if (duplicateOption === 'impairs') {
                weeksToDuplicate = semainesID.filter((_, index) => index % 2 !== 0);
            } else if (duplicateOption === 'custom') {
                weeksToDuplicate = parseWeeks(customWeeks).map(week => semainesID[week - 1]);
            }
        } else {
            weeksToDuplicate = semainesID.slice(selectedRows[0], selectedRows[selectedRows.length - 1] + 1);
        }

        for (const cellKey of selectedCells) {
            const [rowIndex, colIndex] = cellKey.split('-').map(Number);

            for (const week of weeksToDuplicate) {
                try {
                    await addCellToDatabase(
                        week,
                        enseignantId,
                        enseignement.id,
                        groupesID[colIndex],
                        heures,
                        minutes
                    );

                    // Mettre à jour l'état pour afficher les cellules dupliquées
                    setClickedCells((prev) => {
                        const updatedCells = { ...prev };
                        const newCellKey = `${semainesID.indexOf(week)}-${colIndex}`;
                        updatedCells[newCellKey] = {
                            clicked: true,
                            text: `${heures}h${minutes !== 0 ? minutes : ''} - ${enseignantCode}`
                        };
                        return updatedCells;
                    });
                } catch (error) {
                    console.error('Erreur lors de l\'ajout à la base de données:', error);
                }
            }
        }

        setIsLoading(false);
        setShowDuplicatePopup(false);
        handleCloseContextMenu();
    };

    const handleEdit = () => {
        // Logique pour modifier la cellule
        handleCloseContextMenu();
    };

    const handleMove = () => {
        // Logique pour déplacer la cellule
        handleCloseContextMenu();
    };

    const handleDelete = async () => {
        const selectedCells = Object.keys(clickedCells).filter(key => clickedCells[key]?.selected && !key.startsWith('semaine-'));

        for (const cellKey of selectedCells) {
            const [rowIndex, colIndex] = cellKey.split('-').map(Number);

            try {
                await deleteCellFromDatabase(
                    semainesID[rowIndex],
                    groupesID[colIndex]
                );
            } catch (error) {
                console.error('Erreur lors de la suppression de la base de données:', error);
            }
        }

        // Mettre à jour l'état pour décocher les cellules supprimées
        setClickedCells((prev) => {
            const updatedCells = { ...prev };
            selectedCells.forEach(cellKey => {
                updatedCells[cellKey] = {
                    ...updatedCells[cellKey],
                    selected: false,
                    clicked: false,
                    text: ""
                };
            });
            return updatedCells;
        });

        handleCloseContextMenu();
    };

    return (
        <>
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                </div>
            )}
            <tbody>
                {semaines.map((semaine, rowIndex) => (
                    <tr key={semaine}>
                        <td
                            className="border border-black p-2"
                            style={{ height: '70px', cursor: contextMenu ? 'default' : 'pointer', position: 'relative' }}
                            onClick={() => handleClick(rowIndex, 0, null, null, true)}
                        >
                            {semaine}
                            {showIcons && Object.keys(clickedCells).some(key => key.startsWith(`${rowIndex}-`) && clickedCells[key]?.text) && (
                                <div 
                                    style={{ 
                                        position: 'absolute', 
                                        top: '4px', 
                                        right: '4px', 
                                        width: '8px', 
                                        height: '8px', 
                                        borderRadius: '50%', 
                                        border: '1px solid black', 
                                        backgroundColor: clickedCells[`semaine-${rowIndex}`]?.selected ? 'black' : 'transparent' 
                                    }} 
                                />
                            )}
                        </td>
                        {Array.from({ length: nbGroupe }, (_, index) => (
                            <td
                                key={index}
                                className={`border border-black p-2 ${
                                    clickedCells[`${rowIndex}-${index}`]?.clicked 
                                        ? getColorClass(index, nbCM, nbTD) 
                                        : ''
                                }`}
                                style={{ cursor: contextMenu ? 'default' : 'pointer', width: `${100 / (nbGroupe+2)}%`, position: 'relative' }}
                                onClick={() => handleClick(
                                    rowIndex,
                                    index,
                                    semainesID[rowIndex],
                                    groupesID[index],
                                    false
                                )}
                                onContextMenu={(event) => handleContextMenu(event, rowIndex, index)}
                            >
                                {showIcons && clickedCells[`${rowIndex}-${index}`]?.text && (
                                    <div 
                                        style={{ 
                                            position: 'absolute', 
                                            top: '4px', 
                                            right: '4px', 
                                            width: '8px', 
                                            height: '8px', 
                                            borderRadius: '50%', 
                                            border: '1px solid black', 
                                            backgroundColor: clickedCells[`${rowIndex}-${index}`]?.selected ? 'black' : 'transparent' 
                                        }} 
                                    />
                                )}
                                {clickedCells[`${rowIndex}-${index}`]?.text && (
                                    <h3>{clickedCells[`${rowIndex}-${index}`].text}</h3>
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
            {contextMenu && (
                <ContextMenu
                    contextMenu={contextMenu}
                    handleDuplicate={handleDuplicate}
                    handleEdit={handleEdit}
                    handleMove={handleMove}
                    handleDelete={handleDelete}
                />
            )}
            {showDuplicatePopup && (
                <DuplicatePopup
                    duplicateOption={duplicateOption}
                    setDuplicateOption={setDuplicateOption}
                    customWeeks={customWeeks}
                    setCustomWeeks={setCustomWeeks}
                    handleDuplicateConfirm={handleDuplicateConfirm}
                    setShowDuplicatePopup={setShowDuplicatePopup}
                />
            )}
        </>
    );
}

export default TableBody;