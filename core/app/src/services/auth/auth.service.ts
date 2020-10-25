import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, Subscription, throwError} from 'rxjs';
import {catchError, distinctUntilChanged, finalize, take} from 'rxjs/operators';
import {LoginUiComponent} from '@components/login/login.component';
import {User} from '@services/user/user';
import {MessageService} from '@services/message/message.service';
import {StateManager} from '@base/store/state-manager';
import {LanguageStore} from '@store/language/language.store';
import {BnNgIdleService} from 'bn-ng-idle';
import {AppStateStore} from '@store/app-state/app-state.store';
import {LocalStorageService} from '@services/local-storage/local-storage.service';

export interface SessionStatus {
    active?: boolean;
    id?: string;
    firstName?: string;
    lastName?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    protected timerSet = false;
    private currentUserSubject = new BehaviorSubject<User>({} as User);
    currentUser$ = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
    isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    defaultTimeout = '3600';

    constructor(
        private http: HttpClient,
        protected router: Router,
        protected message: MessageService,
        protected stateManager: StateManager,
        protected languageStore: LanguageStore,
        private bnIdle: BnNgIdleService,
        protected appStateStore: AppStateStore,
        protected localStorage: LocalStorageService
    ) {
    }

    getCurrentUser(): User {
        return this.currentUserSubject.value;
    }

    setCurrentUser(data): void {
        this.currentUserSubject.next(data);
        this.isUserLoggedIn.next(true);
    }

    doLogin(
        caller: LoginUiComponent,
        username: string,
        password: string,
        onSuccess: (caller: LoginUiComponent, response: string) => void,
        onError: (caller: LoginUiComponent, error: HttpErrorResponse) => void
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
            onSuccess(caller, response);
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
            onError(caller, error);
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
                    this.message.addSuccessMessageByKey(messageKey);
                },
                () => {
                    this.message.log('Error on logout');
                    this.message.addSuccessMessageByKey(messageKey);
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
