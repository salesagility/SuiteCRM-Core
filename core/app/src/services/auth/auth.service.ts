import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, finalize, take} from 'rxjs/operators';
import {LoginUiComponent} from '@components/login/login.component';
import {User} from '@services/user/user';
import {MessageService} from '@services/message/message.service';
import {StateManager} from '@base/facades/state-manager';
import {LanguageFacade} from '@base/facades/language/language.facade';
import {BnNgIdleService} from 'bn-ng-idle';
import {SystemConfigFacade} from "@base/facades/system-config/system-config.facade";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public currentUser$: Observable<User>;
    private currentUserSubject: BehaviorSubject<User>;
    defaultTimeout: string = '3600';
    public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private http: HttpClient,
        protected router: Router,
        protected message: MessageService,
        protected stateManager: StateManager,
        protected languageFacade: LanguageFacade,
        private bnIdle: BnNgIdleService,
        protected systemConfigFacade: SystemConfigFacade
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(null);
        this.currentUser$ = this.currentUserSubject.asObservable();
    }

    doLogin(
        caller: LoginUiComponent,
        username: string,
        password: string,
        onSuccess: (caller: LoginUiComponent, response: string) => void,
        onError: (caller: LoginUiComponent, error: HttpErrorResponse) => void
    ) {
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

            let duration = response.duration;

            if (duration === 0 || duration === '0') {
                return;
            }

            if (duration) {
                this.defaultTimeout = duration;
            }

            this.bnIdle.startWatching(this.defaultTimeout).subscribe((res) => {
                if (res) {
                    this.logout('LBL_SESSION_EXPIRED');
                    this.message.removeMessages();
                    this.message.addDangerMessage('Session Expired');
                }
            })
        }, (error: HttpErrorResponse) => {
            onError(caller, error);
        });
    }

    /**
     * Logout user
     *
     * @param messageKey of message to display
     */
    logout(messageKey = 'LBL_LOGOUT_SUCCESS'): void {
        const logoutUrl = 'logout';

        const body = new HttpParams();
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

        this.http.post(logoutUrl, body.toString(), {headers, responseType: 'text'})
            .pipe(
                take(1),
                catchError(err => {
                    this.message.log('Logout failed');
                    return throwError(err);
                }),
                finalize(() => {
                    this.stateManager.clear();
                    this.router.navigate(['/Login']).finally();
                })
            )
            .subscribe(() => {
                this.message.log('Logout success');
                const label = this.languageFacade.getAppString(messageKey);
                this.message.addSuccessMessage(label);
                this.isUserLoggedIn.next(false);
            });
    }
}
