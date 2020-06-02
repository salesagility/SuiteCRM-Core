import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class GlobalSearch {

    constructor(protected router: Router) {
    }

    /**
     * Public Api
     */

    /**
     * Navigate to global search
     *
     * @param {string} searchTerm to search
     * @returns {object} Promise<boolean>
     */
    public navigateToSearch(searchTerm: string): Promise<boolean> {
        const route = '/home/unified-search';

        let queryString = '';
        if (searchTerm) {
            queryString = searchTerm;
        }

        return this.router.navigate([route], {
            queryParams: {
                // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                query_string: queryString
            }
        });
    }
}
