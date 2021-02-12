/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

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
