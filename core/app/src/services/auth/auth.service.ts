import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams, HttpHeaders, HttpResponse} from '@angular/common/http';
import {LoginUiComponent} from '../../components/login/login.component';
import {LogoutUiComponent} from '../../components/logout/logout.component';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../user/user';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public currentUser$: Observable<User>;
    private currentUserSubject: BehaviorSubject<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(null);
        this.currentUser$ = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
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
        ).subscribe((response: string) => {
            onSuccess(caller, response);
        }, (error: HttpErrorResponse) => {
            onError(caller, error);
        });
    }

    doLogout(
        caller: LogoutUiComponent,
        onSuccess: (caller: LogoutUiComponent, resp: any) => void,
        onError: (caller: LogoutUiComponent, error: HttpErrorResponse) => void
    ) {
        const logoutUrl = 'logout';

        const body = new HttpParams();
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

        return this.http.post(logoutUrl,
            body.toString(),
            {headers, responseType: 'text'}
        ).subscribe((resp) => {
            onSuccess(caller, resp);
        }, (error: HttpErrorResponse) => {
            onError(caller, error);
        });
    }
}
