import { CSVParserService } from '../CSVParserService';

describe('CSVParserService', () => {
    const mockCSVContent = `ligne1,colonne2,colonne3
ligne2,R1,valeur
ligne3,nom,4,5,6,0,non,8,10
ligne4,nom2,1,2,3,0,Alternance,7,8`;

    describe('validateCSVFormat', () => {
        test('should throw error for empty content', () => {
            expect(() => {
                CSVParserService.validateCSVFormat('');
            }).toThrow('Le contenu du fichier CSV est vide');
        });

        test('should return rows for valid content', () => {
            const rows = CSVParserService.validateCSVFormat(mockCSVContent);
            expect(Array.isArray(rows)).toBe(true);
            expect(rows.length).toBeGreaterThan(0);
        });
    });

    describe('extractSemestre', () => {
        test('should extract semestre number from R prefix', () => {
            const rows = mockCSVContent.split('\n').map(row => row.split(','));
            const semestre = CSVParserService.extractSemestre(rows);
            expect(semestre).toBe('1');
        });

        test('should throw error if no semestre found', () => {
            const invalidContent = 'a,b,c\nd,e,f';
            const rows = invalidContent.split('\n').map(row => row.split(','));
            expect(() => {
                CSVParserService.extractSemestre(rows);
            }).toThrow('Impossible de déterminer le semestre');
        });
    });

    describe('parseHeures', () => {
        test('should parse valid numbers', () => {
            expect(CSVParserService.parseHeures('10')).toBe(10);
            expect(CSVParserService.parseHeures('10.5')).toBe(10.5);
        });

        test('should return default value for invalid input', () => {
            expect(CSVParserService.parseHeures('')).toBe(0);
            expect(CSVParserService.parseHeures('invalid')).toBe(0);
        });
    });

    describe('parseCSVContent', () => {
        test('should parse valid CSV content', () => {
            const result = CSVParserService.parseCSVContent(mockCSVContent);
            expect(result).toHaveProperty('listeRecherche');
            expect(result).toHaveProperty('listeHeures');
            expect(result).toHaveProperty('isAlternance');
            expect(result).toHaveProperty('semestre');
        });

        test('should detect alternance', () => {
            const result = CSVParserService.parseCSVContent(mockCSVContent);
            expect(result.isAlternance).toBe(true);
        });

        test('should calculate heures projet correctly', () => {
            const result = CSVParserService.parseCSVContent(mockCSVContent);
            expect(result.listeHeures[0][3]).toBeGreaterThanOrEqual(0);
        });
    });
});
