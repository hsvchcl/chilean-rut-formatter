import type { FormatOptions } from './types';
import { cleanRut } from './clean';
import { parseRut, calculateVerificationDigit } from './utils';

// Pre-compiled regex for adding dots
const DOTS_REGEX = /\B(?=(\d{3})+(?!\d))/g;

/**
 * Default formatting options
 */
const DEFAULT_OPTIONS: Required<FormatOptions> = {
    dots: true,
    dash: true,
    uppercase: true,
};

/**
 * Formats a Chilean RUT with the specified options.
 * 
 * By default, formats as: 12.345.678-9
 * 
 * @param rut - RUT string to format (can include dots, dashes, spaces)
 * @param options - Formatting options
 * @returns Formatted RUT string, or empty string if invalid
 * 
 * @example
 * formatRut('123456785')                    // '12.345.678-5'
 * formatRut('123456785', { dots: false })   // '12345678-5'
 * formatRut('123456785', { dash: false })   // '12.345.6785'
 * formatRut('12345678K', { uppercase: false }) // '12.345.678-k'
 */
export function formatRut(rut: string, options: FormatOptions = {}): string {
    // Merge with defaults
    const opts: Required<FormatOptions> = { ...DEFAULT_OPTIONS, ...options };

    // Clean the RUT
    const cleaned = cleanRut(rut);

    // Parse and validate
    const parsed = parseRut(cleaned);
    if (!parsed) {
        return '';
    }

    // Validate the verification digit
    const expectedDigit = calculateVerificationDigit(parsed.body);
    if (parsed.verificationDigit !== expectedDigit) {
        return '';
    }

    // Format the body
    let formattedBody = parsed.body;
    if (opts.dots) {
        formattedBody = parsed.body.replace(DOTS_REGEX, '.');
    }

    // Format the verification digit
    let dv = parsed.verificationDigit;
    if (!opts.uppercase) {
        dv = dv.toLowerCase();
    }

    // Combine with separator
    const separator = opts.dash ? '-' : '';
    return `${formattedBody}${separator}${dv}`;
}

/**
 * Formats a RUT without validation (use with caution).
 * Useful when you need to format user input as they type.
 * 
 * @param rut - RUT string to format
 * @param options - Formatting options
 * @returns Formatted RUT string
 * 
 * @example
 * formatRutPartial('12345')     // '12.345'
 * formatRutPartial('123456789') // '12.345.678-9'
 */
export function formatRutPartial(rut: string, options: FormatOptions = {}): string {
    const opts: Required<FormatOptions> = { ...DEFAULT_OPTIONS, ...options };
    const cleaned = cleanRut(rut);

    if (cleaned.length === 0) {
        return '';
    }

    // Separate body and potential verification digit
    let body: string;
    let dv: string;

    if (cleaned.length > 1) {
        // Check if last char could be a verification digit (K or any digit)
        const lastChar = cleaned.slice(-1);
        if (/[0-9K]/.test(lastChar)) {
            body = cleaned.slice(0, -1);
            dv = opts.uppercase ? lastChar : lastChar.toLowerCase();
        } else {
            body = cleaned;
            dv = '';
        }
    } else {
        body = cleaned;
        dv = '';
    }

    // Format body with dots if needed
    let formattedBody = body;
    if (opts.dots && body.length > 0) {
        formattedBody = body.replace(DOTS_REGEX, '.');
    }

    // Add verification digit if present
    if (dv) {
        const separator = opts.dash ? '-' : '';
        return `${formattedBody}${separator}${dv}`;
    }

    return formattedBody;
}
