import React, { useState, useEffect } from 'react';

function UpdatePopup({ setShowUpdatePopup, initialData, selectedGroups, handleUpdate }) {
    const [heures, setHeures] = useState(selectedGroups.map(() => `${initialData.heures}:${initialData.minutes}`));
    const [enseignants, setEnseignants] = useState(selectedGroups.map(() => initialData.enseignant));

    const handleHeuresChange = (index, value) => {
        const newHeures = [...heures];
        newHeures[index] = value;
        setHeures(newHeures);
    };

    const handleEnseignantChange = (index, value) => {
        const newEnseignants = [...enseignants];
        newEnseignants[index] = value;
        setEnseignants(newEnseignants);
    };

    const handleConfirm = () => {
        const updatedData = selectedGroups.map((groupe, index) => ({
            groupe,
            heures: heures[index],
            enseignant: enseignants[index]
        }));
        handleUpdate(updatedData);
        setShowUpdatePopup(false);
    };

    return (
        <div className="popup-overlay" style={overlayStyle}>
            <div className="popup-content" style={contentStyle}>
                <h2>Modifier</h2>
                <div style={inputContainerStyle}>
                    <div style={columnHeaderStyle}>
                        {selectedGroups.map((groupe, index) => (
                            <div key={`header-${index}`} style={columnStyle}>
                                <label style={labelStyle}>{groupe}</label>
                            </div>
                        ))}
                    </div>
                    <div style={columnHeaderStyle}>
                        {selectedGroups.map((_, index) => (
                            <input
                                key={`heures-${index}`}
                                type="time"
                                value={heures[index]}
                                onChange={(e) => handleHeuresChange(index, e.target.value)}
                                style={inputStyle}
                                placeholder="HH:MM"
                            />
                        ))}
                    </div>
                    <div style={columnHeaderStyle}>
                        {selectedGroups.map((_, index) => (
                            <input
                                key={`enseignant-${index}`}
                                type="text"
                                value={enseignants[index]}
                                onChange={(e) => handleEnseignantChange(index, e.target.value)}
                                style={inputStyle}
                                placeholder="Nom de l'enseignant"
                            />
                        ))}
                    </div>
                </div>
                <div style={buttonContainerStyle}>
                    <button onClick={() => setShowUpdatePopup(false)} style={buttonStyle}>Annuler</button>
                    <button onClick={handleConfirm} style={buttonStyle}>Confirmer</button>
                </div>
            </div>
        </div>
    );
}

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const contentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)',
    maxWidth: '1200px',
    width: '100%',
    textAlign: 'center',
};

const inputContainerStyle = {
    textAlign: 'left',
    marginTop: '10px',
};

const columnHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
};

const columnStyle = {
    flex: 1,
    textAlign: 'center',
};

const labelStyle = {
    fontSize: '18px',
};

const inputStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    marginBottom: '10px',
};

const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
};

const buttonStyle = {
    marginLeft: '10px',
};

export default UpdatePopup;
