import axios from 'axios';

export const fetchGroupes = async (promoId) => {
    const response = await fetch(`/api/groupes/${promoId}`);
    return response.json();
};

export const fetchSemaines = async () => {
    const response = await fetch('/api/semaines');
    return response.json();
};

export const fetchEnseignant = async (enseignantId) => {
    const response = await fetch(`/api/enseignant/${enseignantId}`);
    return response.json();
};

export const fetchCases = async (enseignementId) => {
    const response = await axios.get(`/cases/${enseignementId}`);
    return response.data;
};

export const fetchEnseignantCodes = async (enseignantIds) => {
    const response = await Promise.all(
        enseignantIds.map((id) => axios.get(`/api/enseignant/${id}`))
    );
    return Object.fromEntries(
        enseignantIds.map((id, index) => [id, response[index].data.code])
    );
};
