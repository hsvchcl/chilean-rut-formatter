import type { ParsedRut } from './types';

/**
 * Calculates the verification digit for a RUT body using Module 11 algorithm.
 * 
 * @param rutBody - RUT body (numbers only, without verification digit)
 * @returns Calculated verification digit ('0'-'9' or 'K')
 */
export function calculateVerificationDigit(rutBody: string): string {
    // Multiplier sequence for Module 11 algorithm
    const multipliers = [2, 3, 4, 5, 6, 7];

    let sum = 0;
    let multiplierIndex = 0;

    // Process digits from right to left
    for (let i = rutBody.length - 1; i >= 0; i--) {
        const digit = parseInt(rutBody[i], 10);
        sum += digit * multipliers[multiplierIndex];
        multiplierIndex = (multiplierIndex + 1) % 6; // Cycle through multipliers
    }

    // Calculate verification digit
    const remainder = sum % 11;
    const result = 11 - remainder;

    // Convert result to verification digit
    if (result === 11) return '0';
    if (result === 10) return 'K';
    return result.toString();
}

/**
 * Parses a cleaned RUT string into body and verification digit.
 * 
 * @param cleanedRut - Cleaned RUT string (only numbers and K)
 * @returns Parsed RUT object or null if invalid format
 */
export function parseRut(cleanedRut: string): ParsedRut | null {
    if (cleanedRut.length < 2) {
        return null;
    }

    const verificationDigit = cleanedRut.slice(-1);
    const body = cleanedRut.slice(0, -1);

    // Body must contain only digits
    if (!/^\d+$/.test(body)) {
        return null;
    }

    // Verification digit must be a digit or K
    if (!/^[0-9K]$/.test(verificationDigit)) {
        return null;
    }

    return { body, verificationDigit };
}
