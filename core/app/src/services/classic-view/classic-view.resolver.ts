import {Injectable} from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';


import {ClassicViewFacade} from '@services/classic-view/classic-view.facade';

@Injectable({providedIn: 'root'})
export class ClassicViewResolver implements Resolve<any> {

    constructor(private classicViewFacade: ClassicViewFacade) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const params = {
            ...route.queryParams
        }

        if (route.params.action) {
            params.action = route.params.action;
        }

        if (route.params.record) {
            params.record = route.params.record;
        }

        return this.classicViewFacade.load(route.params.module, params);
    }
}
