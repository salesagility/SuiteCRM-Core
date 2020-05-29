import {Injectable} from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map, take} from 'rxjs/operators';
import {AuthService, SessionStatus} from './auth.service';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {AppStateStore} from '@store/app-state/app-state.store';


@Injectable({
    providedIn: 'root'
})
export class LoginAuthGuard implements CanActivate {
    constructor(
        protected router: Router,
        private authService: AuthService,
        protected systemConfigStore: SystemConfigStore,
        protected appStateStore: AppStateStore
    ) {
    }

    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        const homePage = this.systemConfigStore.getHomePage();
        const homePageUrlTree: UrlTree = this.router.parseUrl(homePage);

        if (this.authService.isUserLoggedIn.value) {
            return homePageUrlTree;
        }

        // if has has been loaded and user is not active go to login
        if (this.appStateStore.isLoaded()){
            return true;
        }

        return this.authService.fetchSessionStatus()
            .pipe(
                take(1),
                map((user: SessionStatus) => {

                    if (user && user.active === true) {
                        // Session is active, go to home page
                        this.authService.setCurrentUser(user);
                        return homePageUrlTree;
                    }

                    // Stay on login
                    return true;
                }),
                catchError(() => of(true))
            );
    }
}
