/**
 * Deep clones an object
 *
 * @param obj  to clone
 * @returns any
 */
export const deepClone = (obj: any): any => JSON.parse(JSON.stringify(obj));
