import React, { useState, useReducer } from "react";
import { CSVParserService } from "../services/CSVParserService";
import { APIService } from "../services/APIService";
import PropTypes from 'prop-types';

// Définition du reducer pour la gestion d'état
const initialState = {
    status: 'idle',
    data: {
        listeRecherche: [],
        listeHeures: [],
        isAlternance: false,
        semestre: null
    },
    error: null
};

function reducer(state, action) {
    switch (action.type) {
        case 'PARSING_START':
            return { ...state, status: 'parsing', error: null };
        case 'PARSING_SUCCESS':
            return { 
                ...state, 
                status: 'parsed', 
                data: action.payload,
                error: null 
            };
        case 'PARSING_ERROR':
            return { ...state, status: 'error', error: action.payload };
        case 'SAVING_START':
            return { ...state, status: 'saving', error: null };
        case 'SAVING_SUCCESS':
            return { ...state, status: 'saved', error: null };
        case 'SAVING_ERROR':
            return { ...state, status: 'error', error: action.payload };
        case 'UPDATE_HEURES':
            const newListeHeures = [...state.data.listeHeures];
            newListeHeures[action.payload.index][action.payload.field] = action.payload.value;
            return {
                ...state,
                data: {
                    ...state.data,
                    listeHeures: newListeHeures
                }
            };
        default:
            return state;
    }
}

function ImportPopup({ onClose, promoId }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        dispatch({ type: 'PARSING_START' });

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const content = e.target.result;
                    const parsedData = CSVParserService.parseCSVContent(content);
                    dispatch({ type: 'PARSING_SUCCESS', payload: parsedData });
                } catch (error) {
                    dispatch({ type: 'PARSING_ERROR', payload: error.message });
                }
            };
            reader.readAsText(file);
        } catch (error) {
            dispatch({ type: 'PARSING_ERROR', payload: 'Erreur lors de la lecture du fichier' });
        }
    };

    const handleInputChange = (index, field, value) => {
        const parsedValue = CSVParserService.parseHeures(value);
        dispatch({
            type: 'UPDATE_HEURES',
            payload: { index, field, value: parsedValue }
        });
    };

    const handleValidate = async () => {
        if (state.status !== 'parsed' && state.status !== 'error') {
            return;
        }

        dispatch({ type: 'SAVING_START' });

        try {
            const promo = await APIService.getPromo(promoId);
            const { listeRecherche, listeHeures, isAlternance, semestre } = state.data;

            const enseignements = listeRecherche.map((nom, index) => ({
                nom,
                promo_id: promoId,
                alternant: false,
                nombre_heures_cm: listeHeures[index][0],
                nombre_heures_td: listeHeures[index][1],
                nombre_heures_tp: listeHeures[index][2],
                semestre,
                nombre_heures_projet: listeHeures[index][3]
            }));

            if (promo.alternant_id && isAlternance) {
                const alternanceEnseignements = listeRecherche.map((nom, index) => ({
                    ...enseignements[index],
                    promo_id: promo.alternant_id,
                    alternant: true
                }));
                await APIService.saveEnseignements(alternanceEnseignements);
            }

            await APIService.saveEnseignements(enseignements);
            dispatch({ type: 'SAVING_SUCCESS' });
            onClose();
        } catch (error) {
            dispatch({ type: 'SAVING_ERROR', payload: error.message });
        }
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <input 
                    type="file" 
                    accept=".csv" 
                    onChange={handleFileChange}
                    disabled={state.status === 'saving'}
                />

                {state.error && (
                    <div className="error-message">{state.error}</div>
                )}

                {state.status === 'saving' && (
                    <div className="loading-message">Sauvegarde en cours...</div>
                )}
                
                <div className="tableau-import">
                    {state.data.listeRecherche.length > 0 && (
                        <table>
                            <thead>
                                <tr>
                                    <th rowSpan={2}>Ressources / SAE</th>
                                    <th colSpan={4}>Formation initiale</th>
                                    {state.data.isAlternance && (
                                        <th colSpan={4}>Alternance</th>
                                    )}
                                </tr>
                                <tr>
                                    <th>CM</th>
                                    <th>TD</th>
                                    <th>TP</th>
                                    <th>Heures projet</th>
                                    {state.data.isAlternance && (
                                        <>
                                            <th>CM</th>
                                            <th>TD</th>
                                            <th>TP</th>
                                            <th>Heures projet</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {state.data.listeRecherche.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item}</td>
                                        {[0, 1, 2, 3].map((field) => (
                                            <td key={field}>
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.5"
                                                        value={state.data.listeHeures[index][field]}
                                                        onChange={(e) => handleInputChange(index, field, e.target.value)}
                                                        className="heures-input"
                                                    />
                                                ) : (
                                                    state.data.listeHeures[index][field]
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="button-container">
                    <button
                        onClick={handleValidate}
                        disabled={state.status === 'saving'}
                        className={state.status === 'saving' ? 'button-disabled' : ''}
                    >
                        Valider
                    </button>
                    <button
                        onClick={toggleEditMode}
                        disabled={state.status === 'saving'}
                    >
                        {isEditing ? "Terminer" : "Modifier"}
                    </button>
                </div>
            </div>
        </div>
    );
}

ImportPopup.propTypes = {
    onClose: PropTypes.func.isRequired,
    promoId: PropTypes.string.isRequired
};

export default ImportPopup;