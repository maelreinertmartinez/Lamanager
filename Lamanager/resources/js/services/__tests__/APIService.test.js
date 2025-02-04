import { APIService } from '../APIService';
import axios from 'axios';

jest.mock('axios');

describe('APIService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getPromo', () => {
        test('should fetch promo successfully', async () => {
            const mockPromo = { id: 1, name: 'Test Promo' };
            axios.get.mockResolvedValueOnce({ data: mockPromo });

            const result = await APIService.getPromo(1);
            expect(result).toEqual(mockPromo);
            expect(axios.get).toHaveBeenCalledWith('/api/promo/1');
        });

        test('should handle error when fetching promo', async () => {
            axios.get.mockRejectedValueOnce(new Error('Network error'));

            await expect(APIService.getPromo(1))
                .rejects
                .toThrow('Erreur lors de la récupération de la promo');
        });
    });

    describe('saveEnseignement', () => {
        const mockEnseignement = {
            nom: 'Test',
            promo_id: 1,
            alternant: false,
            nombre_heures_cm: 10
        };

        test('should save enseignement successfully', async () => {
            axios.post.mockResolvedValueOnce({ data: mockEnseignement });

            const result = await APIService.saveEnseignement(mockEnseignement);
            expect(result).toEqual(mockEnseignement);
            expect(axios.post).toHaveBeenCalledWith('api/enseignements', mockEnseignement);
        });

        test('should handle error when saving enseignement', async () => {
            axios.post.mockRejectedValueOnce(new Error('Network error'));

            await expect(APIService.saveEnseignement(mockEnseignement))
                .rejects
                .toThrow('Erreur lors de la sauvegarde de l\'enseignement');
        });
    });

    describe('saveEnseignements', () => {
        const mockEnseignements = [
            { nom: 'Test1', promo_id: 1 },
            { nom: 'Test2', promo_id: 1 }
        ];

        test('should save multiple enseignements successfully', async () => {
            axios.post.mockResolvedValue({ data: mockEnseignements[0] });

            const results = await APIService.saveEnseignements(mockEnseignements);
            expect(results).toHaveLength(2);
            expect(axios.post).toHaveBeenCalledTimes(2);
        });

        test('should handle error when saving multiple enseignements', async () => {
            axios.post.mockRejectedValueOnce(new Error('Network error'));

            await expect(APIService.saveEnseignements(mockEnseignements))
                .rejects
                .toThrow('Erreur lors de la sauvegarde des enseignements');
        });
    });

    describe('getEnseignements', () => {
        test('should fetch enseignements successfully', async () => {
            const mockEnseignements = [
                { id: 1, nom: 'Test1' },
                { id: 2, nom: 'Test2' }
            ];
            axios.get.mockResolvedValueOnce({ data: mockEnseignements });

            const result = await APIService.getEnseignements(1, 2023);
            expect(result).toEqual(mockEnseignements);
            expect(axios.get).toHaveBeenCalledWith('/api/enseignements/1/2023');
        });

        test('should handle error when fetching enseignements', async () => {
            axios.get.mockRejectedValueOnce(new Error('Network error'));

            await expect(APIService.getEnseignements(1, 2023))
                .rejects
                .toThrow('Erreur lors du chargement des enseignements');
        });
    });
});
