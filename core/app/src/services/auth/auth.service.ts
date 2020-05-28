import {Injectable} from '@angular/core';
import {Router, UrlTree} from '@angular/router';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, of, Subscription, throwError} from 'rxjs';
import {catchError, distinctUntilChanged, finalize, map, take, tap} from 'rxjs/operators';
import {LoginUiComponent} from '@components/login/login.component';
import {User} from '@services/user/user';
import {MessageService} from '@services/message/message.service';
import {StateManager} from '@base/store/state-manager';
import {LanguageFacade} from '@base/store/language/language.facade';
import {BnNgIdleService} from 'bn-ng-idle';
import {AppStateFacade} from '@base/store/app-state/app-state.facade';

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
    private currentUserSubject = new BehaviorSubject<User>({} as User);
    public currentUser$ = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
    public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    defaultTimeout = '3600';

    constructor(
        private http: HttpClient,
        protected router: Router,
        protected message: MessageService,
        protected stateManager: StateManager,
        protected languageFacade: LanguageFacade,
        private bnIdle: BnNgIdleService,
        protected appStateFacade: AppStateFacade
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
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        const params = new HttpParams()
            .set('username', username)
            .set('password', password);

        return this.http.post(
            loginUrl,
            params.toString(),
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
        this.appStateFacade.updateLoading('logout', true);

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
                    this.appStateFacade.updateLoading('logout', false);
                    if (redirect === true) {
                        this.router.navigate(['/Login']).finally();
                    }
                })
            )
            .subscribe(() => {
                this.message.log('Logout success');
                const label = this.languageFacade.getAppString(messageKey);
                this.message.addSuccessMessage(label);
            });
    }

    /**
     * On logout state reset
     */
    public resetState(): void {
        this.stateManager.clearAuthBased();
        this.isUserLoggedIn.next(false);
    }

    /**
     * Fetch session status from backend
     *
     * @returns {{}} Observable<SessionStatus>
     */
    public fetchSessionStatus(): Observable<SessionStatus>{

        const Url = 'session-status';
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

        return this.http.get(Url, {headers});
    }
}
