import React from 'react';

function DuplicatePopup({ duplicateOption, setDuplicateOption, customWeeks, setCustomWeeks, handleDuplicateConfirm, setShowDuplicatePopup }) {
    return (
        <div className="popup-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div className="popup-content" style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)',
                maxWidth: '600px',
                width: '100%'
            }}>
                <h2>Dupliquer</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', height: '30px' }}>
                        <input
                            type="radio"
                            value="pairs"
                            checked={duplicateOption === 'pairs'}
                            onChange={() => setDuplicateOption('pairs')}
                        />
                        <span style={{ marginLeft: '10px' }}>Semaines paires</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', height: '30px' }}>
                        <input
                            type="radio"
                            value="impairs"
                            checked={duplicateOption === 'impairs'}
                            onChange={() => setDuplicateOption('impairs')}
                        />
                        <span style={{ marginLeft: '10px' }}>Semaines impaires</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', height: '30px' }}>
                        <input
                            type="radio"
                            value="custom"
                            checked={duplicateOption === 'custom'}
                            onChange={() => setDuplicateOption('custom')}
                        />
                        <span style={{ marginLeft: '10px' }}>Semaines spécifiques</span>
                        {duplicateOption === 'custom' && (
                            <input
                                type="text"
                                value={customWeeks}
                                onChange={(e) => setCustomWeeks(e.target.value)}
                                placeholder="Ex: 1,3,5 ou 1-5"
                                style={{ marginLeft: '10px' }}
                            />
                        )}
                    </label>
                </div>
                <button onClick={handleDuplicateConfirm} style={{ marginRight: '10px', marginTop: '20px' }}>Confirmer</button>
                <button onClick={() => setShowDuplicatePopup(false)}>Annuler</button>
            </div>
        </div>
    );
}

export default DuplicatePopup;
