import {Injectable} from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map, take} from 'rxjs/operators';
import {AuthService, SessionStatus} from './auth.service';
import {SystemConfigFacade} from '@base/facades/system-config/system-config.facade';
import {AppStateFacade} from '@base/facades/app-state/app-state.facade';


@Injectable({
    providedIn: 'root'
})
export class LoginAuthGuard implements CanActivate {
    constructor(
        protected router: Router,
        private authService: AuthService,
        protected systemConfigFacade: SystemConfigFacade,
        protected appStateFacade: AppStateFacade
    ) {
    }

    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        const homePage = this.systemConfigFacade.getHomePage();
        const homePageUrlTree: UrlTree = this.router.parseUrl(homePage);

        if (this.authService.isUserLoggedIn.value) {
            return homePageUrlTree;
        }

        // if has has been loaded and user is not active go to login
        if (this.appStateFacade.isLoaded()){
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
