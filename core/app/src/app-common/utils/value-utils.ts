/**
 * Check if value is false
 *
 * @param {any} value to check
 * @returns {boolean} isFalse
 */
export const isFalse = (value: any): boolean => (value === false || value === 'false');

/**
 * Check if value is true
 *
 * @param {any} value to check
 * @returns {boolean} isFalse
 */
export const isTrue = (value: any): boolean => (value === true || value === 'true');
