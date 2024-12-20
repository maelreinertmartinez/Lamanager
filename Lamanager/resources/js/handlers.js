import { addCellToDatabase, deleteCellFromDatabase } from './utils';

export const handleClick = (
    rowIndex, colIndex, semaineId, groupeId, isSemaineColumn, contextMenu, enseignantId, 
    onCellClick, showIcons, setClickedCells, nbGroupe, enseignement, groupesID, semainesID, 
    enseignantCode, heures, minutes, clickedCells, handleCellClick
) => {
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

export const handleContextMenu = (event, rowIndex, colIndex, showIcons, clickedCells, setContextMenu) => {
    event.preventDefault();
    event.stopPropagation();
    if (showIcons && clickedCells[`${rowIndex}-${colIndex}`]?.text) {
        const selectedCells = Object.keys(clickedCells).filter(key => clickedCells[key]?.selected && !key.startsWith('semaine-'));
        const selectedRows = [...new Set(selectedCells.map(key => key.split('-')[0]))];
        const canDuplicate = selectedRows.length === 1;

        setContextMenu({
            mouseX: event.clientX,
            mouseY: event.clientY,
            rowIndex,
            colIndex,
            canDuplicate
        });
    }
};

export const handleCloseContextMenu = (setContextMenu) => {
    if (typeof setContextMenu === 'function') {
        setContextMenu(null);
    }
};

export const handleDuplicate = (setShowDuplicatePopup) => {
    setShowDuplicatePopup(true);
};

export const handleDuplicateConfirm = async (
    clickedCells, semainesID, enseignantId, enseignement, groupesID, heures, minutes, 
    enseignantCode, setClickedCells, setIsLoading, setShowDuplicatePopup, handleCloseContextMenu, 
    duplicateOption, customWeeks, parseWeeks
) => {
    setIsLoading(true);
    const selectedCells = Object.keys(clickedCells).filter(key => clickedCells[key]?.selected && !key.startsWith('semaine-'));
    const selectedRows = [...new Set(selectedCells.map(key => key.split('-')[0]))];

    let weeksToDuplicate = [];

    if (selectedRows.length === 1) {
        if (duplicateOption === 'pairs') {
            weeksToDuplicate = semainesID.filter((_, index) => index-1 % 2 === 0);
        } else if (duplicateOption === 'impairs') {
            weeksToDuplicate = semainesID.filter((_, index) => index-1 % 2 !== 0);
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

export const handleEdit = (setShowUpdatePopup, setSelectedGroups, groupNames, clickedCells) => {
    const selectedGroups = groupNames.filter((_, index) => 
        Object.keys(clickedCells).some(key => key.endsWith(`-${index}`) && clickedCells[key]?.selected && clickedCells[key]?.clicked)
    );
    setSelectedGroups(selectedGroups);
    setShowUpdatePopup(true);
};

export const handleMove = (setShowMovePopup) => {
    setShowMovePopup(true);
};

export const handleMoveConfirm = async (
    selectedWeek, clickedCells, semainesID, enseignantId, enseignement, groupesID, heures, minutes, 
    enseignantCode, setClickedCells, setIsLoading, setShowMovePopup, handleCloseContextMenu
) => {
    setIsLoading(true);
    const selectedCells = Object.keys(clickedCells).filter(key => clickedCells[key]?.selected && !key.startsWith('semaine-'));
    const selectedRows = [...new Set(selectedCells.map(key => key.split('-')[0]))].sort((a, b) => a - b);

    // Vérifier si la semaine sélectionnée est la même que la semaine la plus haute de la sélection
    if (parseInt(selectedWeek) === parseInt(selectedRows[0])) {
        setIsLoading(false);
        setShowMovePopup(false);
        handleCloseContextMenu();
        return;
    }

    for (const cellKey of selectedCells) {
        const [rowIndex, colIndex] = cellKey.split('-').map(Number);
        const newRowIndex = parseInt(selectedWeek) + (rowIndex - parseInt(selectedRows[0]));

        try {
            await deleteCellFromDatabase(
                semainesID[rowIndex],
                groupesID[colIndex]
            );

            await addCellToDatabase(
                semainesID[newRowIndex],
                enseignantId,
                enseignement.id,
                groupesID[colIndex],
                heures,
                minutes
            );

            // Mettre à jour l'état pour afficher les cellules déplacées
            setClickedCells((prev) => {
                const updatedCells = { ...prev };
                const newCellKey = `${newRowIndex}-${colIndex}`;
                updatedCells[newCellKey] = {
                    clicked: true,
                    text: `${heures}h${minutes !== 0 ? minutes : ''} - ${enseignantCode}`
                };
                updatedCells[cellKey] = {
                    clicked: false,
                    text: ""
                };
                return updatedCells;
            });
        } catch (error) {
            console.error('Erreur lors du déplacement:', error);
        }
    }

    setIsLoading(false);
    setShowMovePopup(false);
    handleCloseContextMenu();
};

export const handleDelete = (
    clickedCells, semainesID, groupesID, setClickedCells, setContextMenu, setShowDeletePopup
) => {
    setShowDeletePopup(true);
    handleCloseContextMenu(setContextMenu);
};

export const handleDeleteConfirm = async (
    clickedCells, semainesID, groupesID, setClickedCells, setShowDeletePopup, deleteOption, customRows
) => {
    let selectedCells = [];

    if (deleteOption === 'selection') {
        selectedCells = Object.keys(clickedCells).filter(key => clickedCells[key]?.selected && !key.startsWith('semaine-'));
    } else if (deleteOption === 'custom') {
        const rows = parseRows(customRows);
        selectedCells = rows.flatMap(rowIndex => 
            Array.from({ length: groupesID.length }, (_, colIndex) => `${rowIndex - 1}-${colIndex}`)
        );
    }

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

    setShowDeletePopup(false);
};

const parseRows = (rowsString) => {
    const rows = [];
    const ranges = rowsString.split(',');
    ranges.forEach(range => {
        if (range.includes('-')) {
            const [start, end] = range.split('-').map(Number);
            for (let i = start; i <= end; i++) {
                rows.push(i);
            }
        } else {
            rows.push(Number(range));
        }
    });
    return rows;
};

export const parseWeeks = (weeksString) => {
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
