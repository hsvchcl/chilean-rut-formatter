/**
 * Options for formatting a RUT
 */
export interface FormatOptions {
    /** Include dots as thousand separators (e.g., 12.345.678-9). Default: true */
    dots?: boolean;
    /** Include dash before verification digit. Default: true */
    dash?: boolean;
    /** Use uppercase for 'K' verification digit. Default: true */
    uppercase?: boolean;
}

/**
 * Result of RUT validation
 */
export interface ValidationResult {
    /** Whether the RUT is valid */
    isValid: boolean;
    /** Clean RUT string (numbers + verification digit) if valid */
    rut?: string;
    /** Error message if invalid */
    error?: string;
}

/**
 * Parsed RUT components
 */
export interface ParsedRut {
    /** RUT body (numbers only, without verification digit) */
    body: string;
    /** Verification digit (0-9 or K) */
    verificationDigit: string;
}
