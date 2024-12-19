import React, { useState, useEffect } from 'react';
import { handleClick, handleContextMenu, handleCloseContextMenu, handleDuplicate, handleDuplicateConfirm, handleEdit, handleMove, handleMoveConfirm, handleDelete, handleDeleteConfirm, parseWeeks } from '../../handlers';
import ContextMenu from './ContextMenu';
import DuplicatePopup from './DuplicatePopup';
import DeletePopup from './DeletePopup';
import MovePopup from './MovePopup';
import { getColorClass, handleCellClick } from '../../utils';

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
    showIcons,
    setIsLoading // Ajout de setIsLoading
}) {
    const [contextMenu, setContextMenu] = useState(null);
    const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showMovePopup, setShowMovePopup] = useState(false);
    const [duplicateOption, setDuplicateOption] = useState('pairs');
    const [customWeeks, setCustomWeeks] = useState('');
    const [isLoading, setIsLoadingState] = useState(false);

    useEffect(() => {
        const handleClickOutside = () => {
            setContextMenu(null);
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleDeleteClick = () => {
        handleDelete(clickedCells, semainesID, groupesID, setClickedCells, setContextMenu, setShowDeletePopup);
    };

    const handleDeleteConfirmClick = (deleteOption, customRows) => {
        setIsLoading(true); // Début du chargement
        handleDeleteConfirm(clickedCells, semainesID, groupesID, setClickedCells, setShowDeletePopup, deleteOption, customRows)
            .finally(() => setIsLoading(false)); // Fin du chargement
    };

    const handleDuplicateConfirmClick = () => {
        setIsLoading(true); // Début du chargement
        handleDuplicateConfirm(
            clickedCells, semainesID, enseignantId, enseignement, groupesID, heures, minutes, 
            enseignantCode, setClickedCells, setIsLoading, setShowDuplicatePopup, handleCloseContextMenu, 
            duplicateOption, customWeeks, parseWeeks
        ).finally(() => setIsLoading(false)); // Fin du chargement
    };

    const handleMoveConfirmClick = (selectedWeek) => {
        setIsLoading(true); // Début du chargement
        handleMoveConfirm(
            selectedWeek, clickedCells, semainesID, enseignantId, enseignement, groupesID, heures, minutes, 
            enseignantCode, setClickedCells, setIsLoading, setShowMovePopup, handleCloseContextMenu
        ).finally(() => setIsLoading(false)); // Fin du chargement
    };

    return (
        <>
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                </div>
            )}
            {!isLoading && (
                <tbody>
                    {semaines.map((semaine, rowIndex) => (
                        <tr key={semaine}>
                            <td
                                className="border border-black p-2"
                                style={{ height: '70px', cursor: contextMenu ? 'default' : 'pointer', position: 'relative' }}
                                onClick={() => handleClick(
                                    rowIndex, 0, null, null, true, contextMenu, enseignantId, onCellClick, 
                                    showIcons, setClickedCells, nbGroupe, enseignement, groupesID, semainesID, 
                                    enseignantCode, heures, minutes, clickedCells, handleCellClick
                                )}
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
                                        rowIndex, index, semainesID[rowIndex], groupesID[index], false, contextMenu, 
                                        enseignantId, onCellClick, showIcons, setClickedCells, nbGroupe, enseignement, 
                                        groupesID, semainesID, enseignantCode, heures, minutes, clickedCells, handleCellClick
                                    )}
                                    onContextMenu={(event) => handleContextMenu(event, rowIndex, index, showIcons, clickedCells, setContextMenu)}
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
            )}
            {contextMenu && (
                <ContextMenu
                    contextMenu={contextMenu}
                    handleDuplicate={() => handleDuplicate(setShowDuplicatePopup)}
                    handleEdit={() => handleEdit(handleCloseContextMenu)}
                    handleMove={() => handleMove(setShowMovePopup)}
                    handleDelete={handleDeleteClick}
                    handleCloseContextMenu={() => handleCloseContextMenu(setContextMenu)}
                />
            )}
            {showDuplicatePopup && (
                <DuplicatePopup
                    duplicateOption={duplicateOption}
                    setDuplicateOption={setDuplicateOption}
                    customWeeks={customWeeks}
                    setCustomWeeks={setCustomWeeks}
                    handleDuplicateConfirm={handleDuplicateConfirmClick} // Modification ici
                    setShowDuplicatePopup={setShowDuplicatePopup}
                />
            )}
            {showDeletePopup && (
                <DeletePopup
                    handleDeleteConfirm={handleDeleteConfirmClick} // Modification ici
                    setShowDeletePopup={setShowDeletePopup}
                />
            )}
            {showMovePopup && (
                <MovePopup
                    semaines={semaines}
                    handleMoveConfirm={handleMoveConfirmClick} // Modification ici
                    setShowMovePopup={setShowMovePopup}
                />
            )}
        </>
    );
}

export default TableBody;