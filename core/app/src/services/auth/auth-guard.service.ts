import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {MessageService} from '../message/message.service';
import {AuthService} from '../auth/auth.service';
import {Observable, of} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, take, tap} from "rxjs/operators";
import {StateManager} from "@base/facades/state-manager";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        protected message: MessageService,
        protected router: Router,
        protected http: HttpClient,
        private authService: AuthService,
        protected stateManager: StateManager,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.authService.isUserLoggedIn.value) {
            return true;
        }
        const loginUrl = 'Login';
        const tree: UrlTree = this.router.parseUrl(loginUrl);

        const Url = 'session-status';
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

        return this.http.get(Url, {headers})
            .pipe(
                take(1),
                map((user: any) => {
                    if (user && user.active === true) {
                        return true;
                    }
                    // Re-direct to login
                    return tree;
                }),
                catchError(() => of(tree)),
                tap((result: boolean | UrlTree) => {
                    if (result === true) {
                        this.authService.isUserLoggedIn.next(true);
                    }
                })
            );
    }
}
