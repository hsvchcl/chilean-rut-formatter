import { describe, it, expect } from 'vitest';
import {
    cleanRut,
    validateRut,
    isValidRut,
    formatRut,
    formatRutPartial,
    calculateVerificationDigit,
} from '../src';

describe('cleanRut', () => {
    it('should remove dots and dashes', () => {
        expect(cleanRut('12.345.678-9')).toBe('123456789');
    });

    it('should convert K to uppercase', () => {
        expect(cleanRut('12345678-k')).toBe('12345678K');
    });

    it('should remove spaces and special characters', () => {
        expect(cleanRut('  12 345 678 - 9  ')).toBe('123456789');
        expect(cleanRut('12#345$678%9')).toBe('123456789');
    });

    it('should handle empty input', () => {
        expect(cleanRut('')).toBe('');
    });

    it('should handle non-string input gracefully', () => {
        // @ts-expect-error Testing runtime behavior
        expect(cleanRut(null)).toBe('');
        // @ts-expect-error Testing runtime behavior
        expect(cleanRut(undefined)).toBe('');
        // @ts-expect-error Testing runtime behavior
        expect(cleanRut(123)).toBe('');
    });

    it('should truncate extremely long inputs (DoS protection)', () => {
        const longInput = '1'.repeat(1000);
        const result = cleanRut(longInput);
        expect(result.length).toBeLessThanOrEqual(50);
    });
});

describe('calculateVerificationDigit', () => {
    it('should calculate correct verification digit', () => {
        expect(calculateVerificationDigit('12345678')).toBe('5');
        expect(calculateVerificationDigit('11111111')).toBe('1');
        expect(calculateVerificationDigit('44444444')).toBe('4');
        expect(calculateVerificationDigit('22222222')).toBe('2');
    });

    it('should return K for specific RUTs', () => {
        expect(calculateVerificationDigit('10000013')).toBe('K');
    });

    it('should return 0 for specific RUTs', () => {
        expect(calculateVerificationDigit('10000004')).toBe('0');
    });
});

describe('validateRut', () => {
    describe('valid RUTs', () => {
        it('should validate RUT with dots and dash', () => {
            const result = validateRut('12.345.678-5');
            expect(result.isValid).toBe(true);
            expect(result.rut).toBe('123456785');
        });

        it('should validate RUT without dots', () => {
            const result = validateRut('12345678-5');
            expect(result.isValid).toBe(true);
            expect(result.rut).toBe('123456785');
        });

        it('should validate RUT without any separators', () => {
            const result = validateRut('123456785');
            expect(result.isValid).toBe(true);
            expect(result.rut).toBe('123456785');
        });

        it('should validate RUT with K verification digit', () => {
            const result = validateRut('10.000.013-K');
            expect(result.isValid).toBe(true);
            expect(result.rut).toBe('10000013K');
        });

        it('should validate RUT with lowercase k', () => {
            const result = validateRut('10000013-k');
            expect(result.isValid).toBe(true);
            expect(result.rut).toBe('10000013K');
        });

        it('should validate minimum length RUT', () => {
            const result = validateRut('1-9');
            expect(result.isValid).toBe(true);
        });

        it('should validate common test RUTs', () => {
            expect(validateRut('11.111.111-1').isValid).toBe(true);
            expect(validateRut('22.222.222-2').isValid).toBe(true);
            expect(validateRut('44.444.444-4').isValid).toBe(true);
        });
    });

    describe('invalid RUTs', () => {
        it('should reject empty input', () => {
            const result = validateRut('');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('RUT is required');
        });

        it('should reject RUT with wrong verification digit', () => {
            const result = validateRut('12345678-0');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Invalid verification digit');
        });

        it('should reject RUT that is too short', () => {
            const result = validateRut('1');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('RUT is too short');
        });

        it('should reject RUT that is too long', () => {
            const result = validateRut('1234567890123');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('RUT is too long');
        });

        it('should reject RUT with invalid format', () => {
            const result = validateRut('ABCDEFGHI');
            expect(result.isValid).toBe(false);
        });
    });
});

describe('isValidRut', () => {
    it('should return true for valid RUT', () => {
        expect(isValidRut('12.345.678-5')).toBe(true);
        expect(isValidRut('10000013-K')).toBe(true);
    });

    it('should return false for invalid RUT', () => {
        expect(isValidRut('')).toBe(false);
        expect(isValidRut('12345678-0')).toBe(false);
        expect(isValidRut('invalid')).toBe(false);
    });
});

describe('formatRut', () => {
    describe('default options', () => {
        it('should format with dots and dash', () => {
            expect(formatRut('123456785')).toBe('12.345.678-5');
        });

        it('should format RUT with K verification digit', () => {
            expect(formatRut('10000013K')).toBe('10.000.013-K');
        });

        it('should format already formatted RUT', () => {
            expect(formatRut('12.345.678-5')).toBe('12.345.678-5');
        });
    });

    describe('custom options', () => {
        it('should format without dots', () => {
            expect(formatRut('123456785', { dots: false })).toBe('12345678-5');
        });

        it('should format without dash', () => {
            expect(formatRut('123456785', { dash: false })).toBe('12.345.6785');
        });

        it('should format with lowercase K', () => {
            expect(formatRut('10000013K', { uppercase: false })).toBe('10.000.013-k');
        });

        it('should format without dots or dash', () => {
            expect(formatRut('123456785', { dots: false, dash: false })).toBe('123456785');
        });
    });

    describe('invalid input', () => {
        it('should return empty string for invalid RUT', () => {
            expect(formatRut('12345678-0')).toBe('');
            expect(formatRut('')).toBe('');
            expect(formatRut('invalid')).toBe('');
        });
    });
});

describe('formatRutPartial', () => {
    it('should format partial input as user types', () => {
        expect(formatRutPartial('12')).toBe('1-2');
        expect(formatRutPartial('123')).toBe('12-3');
        expect(formatRutPartial('12345')).toBe('1.234-5');
        expect(formatRutPartial('12345678')).toBe('1.234.567-8');
        expect(formatRutPartial('123456789')).toBe('12.345.678-9');
    });

    it('should handle empty input', () => {
        expect(formatRutPartial('')).toBe('');
    });

    it('should respect formatting options', () => {
        expect(formatRutPartial('10000013K', { dots: false })).toBe('10000013-K');
        expect(formatRutPartial('10000013K', { uppercase: false })).toBe('10.000.013-k');
    });
});
