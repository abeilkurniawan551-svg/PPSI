/**
 * Security Utilities for Smart Complaint System
 * Standards: OWASP Top 10, CWE, UU No. 27/2022 (UU PDP)
 * 
 * Mitigations:
 * - CWE-79: DOM Cross-Site Scripting (XSS)
 * - CWE-1236: CSV / Formula Injection
 * - CWE-434: Unrestricted File Upload
 * - CWE-359: Privacy / PII Protection (UU PDP)
 */

/**
 * Escapes unsafe HTML characters to prevent DOM-based XSS attacks (CWE-79).
 * Converts &, <, >, ", ' to their corresponding HTML entities.
 * 
 * @param {string} str - Raw input string
 * @returns {string} Sanitized string safe for HTML rendering
 */
export const escapeHTML = (str) => {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Validates and sanitizes image source URIs.
 * Disallows dangerous URI schemes such as javascript:, vbscript:, and data:text/html.
 * Only permits http://, https://, and valid data:image/ URIs.
 * 
 * @param {string} url - Raw URL or Data URI
 * @returns {string} Safe URL or empty string if invalid/dangerous
 */
export const sanitizeImageSrc = (url) => {
  if (!url) return '';
  const clean = String(url).trim();
  
  // Whitelist safe protocols
  const isHttp = clean.startsWith('http://') || clean.startsWith('https://');
  const isDataImage = clean.startsWith('data:image/jpeg;') ||
                      clean.startsWith('data:image/png;') ||
                      clean.startsWith('data:image/webp;') ||
                      clean.startsWith('data:image/jpg;');

  if (isHttp || isDataImage) {
    // Escape HTML quotes and tags to prevent attribute breakout
    return escapeHTML(clean);
  }

  return '';
};

/**
 * Sanitizes fields exported to CSV files to prevent Formula Injection (CWE-1236 / DDE).
 * Automatically prepends a single quote (') if the field starts with trigger characters:
 * '=', '+', '-', '@', tab (\t), newline (\r/\n), '|', or '%'.
 * 
 * @param {any} val - Field value
 * @returns {string} Quoted, sanitized CSV field
 */
export const sanitizeCsvField = (val) => {
  if (val === null || val === undefined) return '""';
  let str = String(val).replace(/"/g, '""');
  
  // Check for formula triggers
  if (/^[=+\-@\t\r\n|%]/.test(str)) {
    str = `'${str}`;
  }
  
  return `"${str}"`;
};

/**
 * Sanitizes text input: trims whitespace, removes null bytes/control chars,
 * and restricts string to a maximum allowed length.
 * 
 * @param {string} text - Input text
 * @param {number} maxLength - Maximum allowable characters
 * @returns {string} Sanitized string
 */
export const sanitizeText = (text, maxLength = 500) => {
  if (!text) return '';
  return String(text)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove dangerous ASCII control characters
    .trim()
    .slice(0, maxLength);
};

/**
 * Validates Indonesian telephone / WhatsApp numbers format.
 * Allows digits, spaces, hyphens, and optional leading '+'.
 * Length must be between 8 and 20 characters.
 * 
 * @param {string} phone - Input phone number
 * @returns {boolean} True if format is valid or empty
 */
export const isValidPhone = (phone) => {
  if (!phone) return true; // Optional field
  const clean = String(phone).trim();
  if (clean.length === 0) return true;
  // Match standard Indonesian formats (e.g. 0812..., +62812..., 0812-3456-7890)
  const phoneRegex = /^(\+62|62|0)[0-9\s\-]{7,18}$/;
  return phoneRegex.test(clean);
};

/**
 * Validates uploaded photo files against size limits and strict MIME type whitelisting (CWE-434).
 * Max allowable size: 5 MB (5 * 1024 * 1024 bytes).
 * Allowed MIME types: image/jpeg, image/png, image/webp.
 * 
 * @param {File} file - File object from file input
 * @returns {{ valid: boolean, error: string | null }} Validation result
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'Tidak ada berkas yang dipilih.' };
  }

  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
  if (file.size > MAX_SIZE_BYTES) {
    return {
      valid: false,
      error: `Ukuran berkas (${(file.size / (1024 * 1024)).toFixed(2)} MB) melebihi batas maksimum 5 MB.`
    };
  }

  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Format berkas tidak diizinkan. Hanya format JPG, PNG, atau WEBP yang diperbolehkan.'
    };
  }

  return { valid: true, error: null };
};
