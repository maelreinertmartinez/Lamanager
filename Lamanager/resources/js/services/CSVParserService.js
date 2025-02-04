export class CSVParserService {
    static EXPECTED_HEADERS = ['Ressource', 'CM', 'TD', 'TP', 'Total', 'Projet'];
    
    static validateCSVFormat(content) {
        if (!content) {
            throw new Error('Le contenu du fichier CSV est vide');
        }

        const rows = content.split('\n').map(row => row.split(','));
        if (rows.length < 19) { // Au moins l'en-tête + une ligne de données
            throw new Error('Format CSV invalide: nombre de lignes insuffisant');
        }

        return rows;
    }

    static extractSemestre(rows) {
        for (let i = 0; i < rows.length; i++) {
            if (rows[i][1] && rows[i][1].toString().startsWith('R')) {
                return rows[i][1].charAt(1);
            }
        }
        throw new Error('Impossible de déterminer le semestre');
    }

    static parseHeures(value, defaultValue = 0) {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? defaultValue : parsed;
    }

    static parseCSVContent(content) {
        const rows = this.validateCSVFormat(content);
        const listeRecherche = [];
        const listeHeures = [];
        let isAlternance = false;
        let startIndex = 18; // Index de début des données

        try {
            const semestre = this.extractSemestre(rows);

            while (startIndex < rows.length && rows[startIndex][1]) {
                const row = rows[startIndex];
                
                // Extraction des données
                const nom = row[1].trim();
                const cm = this.parseHeures(row[4]);
                const td = this.parseHeures(row[5]);
                const tp = this.parseHeures(row[6]);
                const total = this.parseHeures(row[8]);
                const heuresProjet = Math.max(0, total - (cm + td + tp));

                // Vérification de l'alternance
                if (row[7] === "Alternance") {
                    isAlternance = true;
                }

                listeRecherche.push(nom);
                listeHeures.push([cm, td, tp, heuresProjet]);
                startIndex++;
            }

            return {
                listeRecherche,
                listeHeures,
                isAlternance,
                semestre
            };
        } catch (error) {
            throw new Error(`Erreur lors du parsing du CSV: ${error.message}`);
        }
    }
}
