// Pre-compiled regex for maximum performance
const CLEAN_REGEX = /[^0-9kK]/g;

// Maximum allowed input length for security (prevents DoS)
const MAX_INPUT_LENGTH = 50;

/**
 * Cleans a RUT string by removing all non-valid characters.
 * Keeps only numbers and 'K'/'k'.
 * 
 * @param input - Raw RUT input string
 * @returns Cleaned RUT string with only valid characters
 * 
 * @example
 * cleanRut('12.345.678-9') // '123456789'
 * cleanRut('12345678-K') // '12345678K'
 * cleanRut('  12-345-678.9  ') // '123456789'
 */
export function cleanRut(input: string): string {
    // Security: handle non-string inputs gracefully
    if (typeof input !== 'string') {
        return '';
    }

    // Security: prevent DoS with extremely long inputs
    if (input.length > MAX_INPUT_LENGTH) {
        input = input.slice(0, MAX_INPUT_LENGTH);
    }

    // Remove all non-valid characters and convert to uppercase
    return input.replace(CLEAN_REGEX, '').toUpperCase();
}
