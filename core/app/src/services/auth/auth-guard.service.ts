import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map, take, tap} from 'rxjs/operators';
import {MessageService} from '@services/message/message.service';
import {AuthService} from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        protected message: MessageService,
        protected router: Router,
        private authService: AuthService,
    ) {
    }

    canActivate(
        route: ActivatedRouteSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (this.authService.isUserLoggedIn.value && route.data.checkSession !== true) {
            return true;
        }

        const loginUrl = 'Login';
        const tree: UrlTree = this.router.parseUrl(loginUrl);

        return this.authService.fetchSessionStatus()
            .pipe(
                take(1),
                map((user: any) => {
                    if (user && user.active === true) {
                        this.authService.setCurrentUser(user);
                        return true;
                    }
                    this.authService.logout('LBL_SESSION_EXPIRED', false);
                    // Re-direct to login
                    return tree;
                }),
                catchError(() => {
                    this.authService.logout('LBL_SESSION_EXPIRED', false);
                    return of(tree);
                }),
                tap((result: boolean | UrlTree) => {
                    if (result === true) {
                        this.authService.isUserLoggedIn.next(true);
                    }
                })
            );
    }
}
