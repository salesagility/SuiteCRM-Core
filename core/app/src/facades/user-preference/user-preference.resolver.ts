import {Injectable} from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';

import {UserPreferenceFacade} from '@base/facades/user-preference/user-preference.facade';
import {flatMap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class UserPreferenceResolver implements Resolve<any> {

    constructor(private userPreferenceFacade: UserPreferenceFacade) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.userPreferenceFacade.load();
    }
}
