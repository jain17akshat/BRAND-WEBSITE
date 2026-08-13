/**
 * validateBody.js
 * ─────────────────────────────────────────────────────────
 * Factory function that returns an Express middleware that
 * validates req.body against a schema definition.
 *
 * Supported field types: 'string', 'number', 'email', 'phone'
 *
 * Usage:
 *   router.post('/create-order',
 *     validateBody({
 *       amount:  { type: 'number',  required: true },
 *       receipt: { type: 'string',  required: true },
 *       email:   { type: 'email',   required: false },
 *       phone:   { type: 'phone',   required: false },
 *     }),
 *     handler
 *   );
 */

const { AppError } = require('./errorHandler');

const PHONE_RE = /^[6-9]\d{9}$/;          // Indian 10-digit mobile
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALIDATORS = {
  string:  (v) => typeof v === 'string' && v.trim().length > 0,
  number:  (v) => typeof v === 'number' && !isNaN(v) && v > 0,
  email:   (v) => typeof v === 'string' && EMAIL_RE.test(v.trim()),
  phone:   (v) => typeof v === 'string' && PHONE_RE.test(v.replace(/\D/g, '').slice(-10)),
  boolean: (v) => typeof v === 'boolean',
  array:   (v) => Array.isArray(v) && v.length > 0,
};

const TYPE_HINTS = {
  string:  'a non-empty string',
  number:  'a positive number',
  email:   'a valid email address',
  phone:   'a valid 10-digit Indian mobile number',
  boolean: 'true or false',
  array:   'a non-empty array',
};

/**
 * validateBody(schema)
 * @param {Record<string, { type: string, required?: boolean, min?: number, max?: number }>} schema
 * @returns Express middleware
 */
function validateBody(schema) {
  return (req, res, next) => {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value    = req.body[field];
      const isEmpty  = value === undefined || value === null || value === '';
      const required = rules.required !== false; // default true

      if (isEmpty) {
        if (required) {
          errors.push({ field, message: `"${field}" is required.` });
        }
        continue; // skip further checks for optional empty fields
      }

      const validator = VALIDATORS[rules.type];
      if (validator && !validator(value)) {
        errors.push({
          field,
          message: `"${field}" must be ${TYPE_HINTS[rules.type] || rules.type}.`,
        });
        continue;
      }

      // Range checks for numbers
      if (rules.type === 'number') {
        if (rules.min !== undefined && value < rules.min) {
          errors.push({ field, message: `"${field}" must be at least ${rules.min}.` });
        }
        if (rules.max !== undefined && value > rules.max) {
          errors.push({ field, message: `"${field}" must be at most ${rules.max}.` });
        }
      }

      // Length checks for strings
      if (rules.type === 'string' || rules.type === 'email' || rules.type === 'phone') {
        const str = String(value).trim();
        if (rules.minLength && str.length < rules.minLength) {
          errors.push({ field, message: `"${field}" must be at least ${rules.minLength} characters.` });
        }
        if (rules.maxLength && str.length > rules.maxLength) {
          errors.push({ field, message: `"${field}" must be at most ${rules.maxLength} characters.` });
        }
      }
    }

    if (errors.length > 0) {
      return next(new AppError(
        `Validation failed: ${errors.map(e => e.message).join(' | ')}`,
        400,
        'VALIDATION_ERROR',
        { fields: errors }
      ));
    }

    next();
  };
}

module.exports = validateBody;
