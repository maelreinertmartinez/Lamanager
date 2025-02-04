import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImportPopup from '../ImportPopup';
import { CSVParserService } from '../../services/CSVParserService';
import { APIService } from '../../services/APIService';

jest.mock('../../services/CSVParserService');
jest.mock('../../services/APIService');

describe('ImportPopup', () => {
    const mockOnClose = jest.fn();
    const mockPromoId = '1';
    const mockParsedData = {
        listeRecherche: ['Test1', 'Test2'],
        listeHeures: [[1, 2, 3, 4], [5, 6, 7, 8]],
        isAlternance: false,
        semestre: '1'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        CSVParserService.parseCSVContent.mockResolvedValue(mockParsedData);
        APIService.getPromo.mockResolvedValue({ id: 1, name: 'Test Promo' });
        APIService.saveEnseignements.mockResolvedValue([]);
    });

    test('renders file input', () => {
        render(<ImportPopup onClose={mockOnClose} promoId={mockPromoId} />);
        expect(screen.getByRole('button', { name: /valider/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /modifier/i })).toBeInTheDocument();
    });

    test('handles file selection and parsing', async () => {
        render(<ImportPopup onClose={mockOnClose} promoId={mockPromoId} />);
        
        const file = new File(['test csv content'], 'test.csv', { type: 'text/csv' });
        const input = screen.getByRole('file');
        
        Object.defineProperty(input, 'files', {
            value: [file]
        });
        
        fireEvent.change(input);
        
        await waitFor(() => {
            expect(CSVParserService.parseCSVContent).toHaveBeenCalled();
        });
    });

    test('handles validation and saving', async () => {
        render(<ImportPopup onClose={mockOnClose} promoId={mockPromoId} />);
        
        // Simulate successful file parsing
        const file = new File(['test csv content'], 'test.csv', { type: 'text/csv' });
        const input = screen.getByRole('file');
        Object.defineProperty(input, 'files', { value: [file] });
        fireEvent.change(input);
        
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /valider/i })).not.toBeDisabled();
        });
        
        fireEvent.click(screen.getByRole('button', { name: /valider/i }));
        
        await waitFor(() => {
            expect(APIService.saveEnseignements).toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    test('handles editing mode', async () => {
        render(<ImportPopup onClose={mockOnClose} promoId={mockPromoId} />);
        
        // Simulate successful file parsing
        const file = new File(['test csv content'], 'test.csv', { type: 'text/csv' });
        const input = screen.getByRole('file');
        Object.defineProperty(input, 'files', { value: [file] });
        fireEvent.change(input);
        
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /modifier/i })).not.toBeDisabled();
        });
        
        fireEvent.click(screen.getByRole('button', { name: /modifier/i }));
        
        expect(screen.getByRole('button', { name: /terminer/i })).toBeInTheDocument();
    });

    test('handles errors during parsing', async () => {
        CSVParserService.parseCSVContent.mockRejectedValue(new Error('Invalid CSV'));
        
        render(<ImportPopup onClose={mockOnClose} promoId={mockPromoId} />);
        
        const file = new File(['invalid content'], 'test.csv', { type: 'text/csv' });
        const input = screen.getByRole('file');
        Object.defineProperty(input, 'files', { value: [file] });
        fireEvent.change(input);
        
        await waitFor(() => {
            expect(screen.getByText(/invalid csv/i)).toBeInTheDocument();
        });
    });

    test('handles errors during saving', async () => {
        APIService.saveEnseignements.mockRejectedValue(new Error('Network error'));
        
        render(<ImportPopup onClose={mockOnClose} promoId={mockPromoId} />);
        
        const file = new File(['test content'], 'test.csv', { type: 'text/csv' });
        const input = screen.getByRole('file');
        Object.defineProperty(input, 'files', { value: [file] });
        fireEvent.change(input);
        
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /valider/i })).not.toBeDisabled();
        });
        
        fireEvent.click(screen.getByRole('button', { name: /valider/i }));
        
        await waitFor(() => {
            expect(screen.getByText(/network error/i)).toBeInTheDocument();
        });
    });
});
