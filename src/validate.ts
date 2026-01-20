import type { ValidationResult } from './types';
import { cleanRut } from './clean';
import { parseRut, calculateVerificationDigit } from './utils';

// Minimum valid RUT (1-9)
const MIN_RUT_LENGTH = 2;
// Maximum valid RUT length (including verification digit)
const MAX_RUT_LENGTH = 9;

/**
 * Validates a Chilean RUT (Rol Único Tributario).
 * 
 * Uses the official Module 11 algorithm to verify the check digit.
 * 
 * @param rut - RUT string to validate (can include dots, dashes, spaces)
 * @returns Validation result with isValid flag and cleaned RUT if valid
 * 
 * @example
 * validateRut('12.345.678-5') // { isValid: true, rut: '123456785' }
 * validateRut('12345678-5')   // { isValid: true, rut: '123456785' }
 * validateRut('12345678-0')   // { isValid: false, error: 'Invalid verification digit' }
 * validateRut('')             // { isValid: false, error: 'RUT is required' }
 */
export function validateRut(rut: string): ValidationResult {
    // Handle empty input
    if (!rut || typeof rut !== 'string') {
        return { isValid: false, error: 'RUT is required' };
    }

    // Clean the RUT
    const cleaned = cleanRut(rut);

    // Check minimum length
    if (cleaned.length < MIN_RUT_LENGTH) {
        return { isValid: false, error: 'RUT is too short' };
    }

    // Check maximum length
    if (cleaned.length > MAX_RUT_LENGTH) {
        return { isValid: false, error: 'RUT is too long' };
    }

    // Parse the RUT
    const parsed = parseRut(cleaned);
    if (!parsed) {
        return { isValid: false, error: 'Invalid RUT format' };
    }

    // Calculate expected verification digit
    const expectedDigit = calculateVerificationDigit(parsed.body);

    // Compare with provided verification digit
    if (parsed.verificationDigit !== expectedDigit) {
        return { isValid: false, error: 'Invalid verification digit' };
    }

    return { isValid: true, rut: cleaned };
}

/**
 * Simple boolean check for RUT validity.
 * 
 * @param rut - RUT string to validate
 * @returns true if RUT is valid, false otherwise
 * 
 * @example
 * isValidRut('12.345.678-5') // true
 * isValidRut('12345678-0')   // false
 */
export function isValidRut(rut: string): boolean {
    return validateRut(rut).isValid;
}
