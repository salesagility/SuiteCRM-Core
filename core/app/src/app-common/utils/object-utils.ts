/**
 * Deep clones an object
 *
 * @param {object} obj to clone
 * @returns {string} any
 */
export const deepClone = (obj: any): any => JSON.parse(JSON.stringify(obj));

/**
 * Check if all entries have been loaded and are ready to use
 *
 * @param entries
 * @returns boolean
 */
export const ready = (entries: (Array<any> | Record<string, any>)[]): boolean => {
    let areReady = true;

    entries.every(entry => {

        if (!entry) {
            areReady = false;
            return false;
        }
        if (Array.isArray(entry) && entry.length <= 0) {
            areReady = false;
            return false;
        }

        if (typeof entry === 'object' && Object.keys(entry).length <= 0) {
            areReady = false;
            return false;
        }

        return true;
    });

    return areReady;
};
