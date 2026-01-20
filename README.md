# Chilean RUT Formatter

[![npm version](https://badge.fury.io/js/chilean-rut-formatter.svg)](https://www.npmjs.com/package/chilean-rut-formatter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

High-performance TypeScript library for formatting and validating Chilean RUTs (Rol Único Tributario).

## Features

- ✅ **Validate** RUTs using the official Module 11 algorithm
- ✅ **Format** with customizable options (dots, dashes, case)
- ✅ **Clean** and sanitize user input
- ✅ **TypeScript** - Full type definitions included
- ✅ **Zero dependencies** - Lightweight and fast
- ✅ **Secure** - Input sanitization and DoS protection
- ✅ **Tree-shakeable** - ESM and CJS support

## Installation

```bash
npm install chilean-rut-formatter
```

## Usage

### Validate a RUT

```typescript
import { validateRut, isValidRut } from 'chilean-rut-formatter';

// Full validation with details
const result = validateRut('12.345.678-5');
// { isValid: true, rut: '123456785' }

const invalid = validateRut('12345678-0');
// { isValid: false, error: 'Invalid verification digit' }

// Simple boolean check
isValidRut('12.345.678-5'); // true
isValidRut('12345678-0');   // false
```

### Format a RUT

```typescript
import { formatRut } from 'chilean-rut-formatter';

// Default: with dots and dash
formatRut('123456785');         // '12.345.678-5'
formatRut('12345678K');         // '12.345.678-K'

// Custom options
formatRut('123456785', { dots: false });       // '12345678-5'
formatRut('123456785', { dash: false });       // '12.345.6785'
formatRut('12345678K', { uppercase: false });  // '12.345.678-k'

// Returns empty string if RUT is invalid
formatRut('12345678-0');  // ''
```

### Format Partial Input (Real-time)

```typescript
import { formatRutPartial } from 'chilean-rut-formatter';

// Great for live formatting as user types
formatRutPartial('1');         // '1'
formatRutPartial('12');        // '1-2'
formatRutPartial('12345');     // '1.234-5'
formatRutPartial('123456789'); // '12.345.678-9'
```

### Clean a RUT

```typescript
import { cleanRut } from 'chilean-rut-formatter';

cleanRut('12.345.678-9');    // '123456789'
cleanRut('12 345 678-k');    // '12345678K'
cleanRut('  12#345$678%9 '); // '123456789'
```

### Calculate Verification Digit

```typescript
import { calculateVerificationDigit } from 'chilean-rut-formatter';

calculateVerificationDigit('12345678');  // '5'
calculateVerificationDigit('16612277');  // 'K'
```

## API Reference

### `validateRut(rut: string): ValidationResult`

Validates a Chilean RUT and returns detailed result.

```typescript
interface ValidationResult {
  isValid: boolean;
  rut?: string;    // Cleaned RUT if valid
  error?: string;  // Error message if invalid
}
```

### `isValidRut(rut: string): boolean`

Simple boolean validation check.

### `formatRut(rut: string, options?: FormatOptions): string`

Formats a valid RUT. Returns empty string if RUT is invalid.

```typescript
interface FormatOptions {
  dots?: boolean;      // Include dots (default: true)
  dash?: boolean;      // Include dash (default: true)
  uppercase?: boolean; // Uppercase K (default: true)
}
```

### `formatRutPartial(rut: string, options?: FormatOptions): string`

Formats partial RUT input (useful for real-time formatting).

### `cleanRut(input: string): string`

Removes all non-valid characters from input.

### `calculateVerificationDigit(rutBody: string): string`

Calculates the verification digit for a RUT body.

## Security

- **Input Sanitization**: All inputs are cleaned before processing
- **DoS Protection**: Maximum input length enforced (50 chars)
- **No eval/Function**: No dynamic code execution
- **TypeScript Strict Mode**: Full type safety

## Performance

- **Zero dependencies**: No external library overhead
- **Pre-compiled regex**: Patterns compiled once at module load
- **Early returns**: Fast failure for invalid inputs
- **Minimal allocations**: Optimized for performance

## License

MIT
