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
import {Router} from '@angular/router';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, Subscription, throwError} from 'rxjs';
import {catchError, distinctUntilChanged, finalize, take} from 'rxjs/operators';
import {User} from 'common';
import {MessageService} from '../message/message.service';
import {StateManager} from '../../store/state-manager';
import {LanguageStore} from '../../store/language/language.store';
import {BnNgIdleService} from 'bn-ng-idle';
import {AppStateStore} from '../../store/app-state/app-state.store';
import {LocalStorageService} from '../local-storage/local-storage.service';
import {isEmptyString} from 'common';

export interface SessionStatus {
    appStatus?: AppStatus;
    active?: boolean;
    id?: string;
    firstName?: string;
    lastName?: string;
}

export interface AppStatus {
    installed?: boolean;
    locked?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    currentUser$: Observable<User>;
    isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    defaultTimeout = '3600';
    protected timerSet = false;
    protected currentUserSubject = new BehaviorSubject<User>({} as User);

    constructor(
        protected http: HttpClient,
        protected router: Router,
        protected message: MessageService,
        protected stateManager: StateManager,
        protected languageStore: LanguageStore,
        protected bnIdle: BnNgIdleService,
        protected appStateStore: AppStateStore,
        protected localStorage: LocalStorageService
    ) {
        this.currentUser$ = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
    }

    getCurrentUser(): User {
        return this.currentUserSubject.value;
    }

    setCurrentUser(data): void {
        this.currentUserSubject.next(data);
        this.isUserLoggedIn.next(true);
    }

    doLogin(
        username: string,
        password: string,
        onSuccess: (response: string) => void,
        onError: (error: HttpErrorResponse) => void
    ): Subscription {
        const loginUrl = 'login';

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        return this.http.post(
            loginUrl,
            {
                username,
                password
            },
            {headers}
        ).subscribe((response: any) => {
            onSuccess(response);
            this.isUserLoggedIn.next(true);
            this.setCurrentUser(response);

            const duration = response.duration;

            if (duration === 0 || duration === '0') {
                return;
            }

            if (duration) {
                this.defaultTimeout = duration;
            }

            this.bnIdle.startWatching(this.defaultTimeout).subscribe((res) => {
                if (res && this.isUserLoggedIn.value === true) {
                    this.message.removeMessages();
                    this.logout('LBL_SESSION_EXPIRED');
                }
            });

            this.timerSet = true;
        }, (error: HttpErrorResponse) => {
            onError(error);
        });
    }

    /**
     * Logout user
     *
     * @param {string} messageKey of message to display
     * @param {boolean} redirect to home
     */
    public logout(messageKey = 'LBL_LOGOUT_SUCCESS', redirect = true): void {
        this.appStateStore.updateLoading('logout', true);

        const logoutUrl = 'logout';
        const body = new HttpParams();

        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

        this.resetState();

        this.http.post(logoutUrl, body.toString(), {headers, responseType: 'text'})
            .pipe(
                take(1),
                catchError(err => {
                    this.message.log('Logout failed');
                    return throwError(err);
                }),
                finalize(() => {
                    this.appStateStore.updateLoading('logout', false);
                    if (redirect === true) {
                        this.router.navigate(['/Login']).finally();
                    }
                })
            )
            .subscribe(
                () => {
                    if (this.timerSet) {
                        this.bnIdle.resetTimer();
                        this.bnIdle.stopTimer();
                        this.timerSet = false;
                    }

                    this.message.log('Logout success');
                    if(!isEmptyString(messageKey)) {
                        this.message.addSuccessMessageByKey(messageKey);
                    }
                },
                () => {
                    this.message.log('Error on logout');
                    if(!isEmptyString(messageKey)) {
                        this.message.addSuccessMessageByKey(messageKey);
                    }
                }
            );
    }

    /**
     * On logout state reset
     */
    public resetState(): void {
        this.stateManager.clearAuthBased();
        this.localStorage.clear();
        this.isUserLoggedIn.next(false);
    }

    /**
     * Fetch session status from backend
     *
     * @returns {{}} Observable<SessionStatus>
     */
    public fetchSessionStatus(): Observable<SessionStatus> {

        const Url = 'session-status';
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

        return this.http.get(Url, {headers});
    }
}
