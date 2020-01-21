import {Injectable} from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';


import {ApiService} from "../api.service";

@Injectable({providedIn: 'root'})
export class ClassicViewResolver implements Resolve<any> {

    constructor(private apiService: ApiService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        return this.apiService.getClassicView(route.paramMap);
    }
}
