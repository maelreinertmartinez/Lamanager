import axios from 'axios';

export class APIService {
    static async getPromo(promoId) {
        try {
            const response = await axios.get(`/api/promo/${promoId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération de la promo: ${error.message}`);
        }
    }

    static async saveEnseignement(data) {
        try {
            const response = await axios.post('api/enseignements', data);
            return response.data;
        } catch (error) {
            throw new Error(`Erreur lors de la sauvegarde de l'enseignement: ${error.message}`);
        }
    }

    static async saveEnseignements(enseignements) {
        try {
            const results = await Promise.all(
                enseignements.map(enseignement => this.saveEnseignement(enseignement))
            );
            return results;
        } catch (error) {
            throw new Error(`Erreur lors de la sauvegarde des enseignements: ${error.message}`);
        }
    }

    static async getEnseignements(promoId, anneeId) {
        try {
            const response = await axios.get(`/api/enseignements/${promoId}/${anneeId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Erreur lors du chargement des enseignements: ${error.message}`);
        }
    }
}
