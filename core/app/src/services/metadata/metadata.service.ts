import {Injectable} from '@angular/core';

import { NavigationMetadata } from './navigation/navigation.metadata.service';


/**
 * Facade like service to retrieve metadata
 */
@Injectable({
    providedIn: 'root',
})
export class Metadata {
    constructor(private navigationMetadata: NavigationMetadata) {}

    public getNavigation() {
        return this.navigationMetadata.fetch();
    }
}