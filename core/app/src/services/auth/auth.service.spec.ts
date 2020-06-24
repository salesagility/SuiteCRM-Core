import {TestBed} from '@angular/core/testing';
import {AuthService} from '@services/auth/auth.service';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {of} from 'rxjs';
import {localStorageServiceMock} from '@services/local-storage/local-storage.service.spec.mock';

describe('Auth Service', () => {
    let httpMock = null;
    let routerMock = null;
    let messageMock = null;
    let stateManagerMock = null;
    let languageMock = null;
    let service = null;
    let IdleMock = null;
    let appStateMock = null;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        httpMock = jasmine.createSpyObj('HttpClient', ['post']);
        httpMock.post.and.callFake(() => of([]));

        routerMock = jasmine.createSpyObj('Router', ['navigate']);
        routerMock.navigate.and.callFake(() => ({
            finally: (): void => {
            }
        }));

        messageMock = jasmine.createSpyObj('MessageService', ['addSuccessMessageByKey', 'log']);
        messageMock.addSuccessMessageByKey.and.callFake(() => {
        });

        messageMock.log.and.callFake(() => {
        });


        stateManagerMock = jasmine.createSpyObj(
            'StateManager',
            [
                'clear',
                'clearAuthBased'
            ]
        );
        stateManagerMock.clear.and.callFake(() => {
        });

        languageMock = jasmine.createSpyObj('LanguageStore', ['getAppString']);
        languageMock.getAppString.and.callFake((key: string) => key);

        IdleMock = jasmine.createSpyObj('bnIdle', ['doLogin']);
        appStateMock = jasmine.createSpyObj('AppStateStore', ['updateLoading']);

        service = new AuthService(
            httpMock,
            routerMock,
            messageMock,
            stateManagerMock,
            languageMock,
            IdleMock,
            appStateMock,
            localStorageServiceMock
        );

    });

    it('#logout', () => {
        service.logout();

        const body = new HttpParams();
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

        expect(httpMock.post).toHaveBeenCalledWith('logout', body.toString(), {headers, responseType: 'text'});

        expect(stateManagerMock.clearAuthBased).toHaveBeenCalledWith();
        expect(messageMock.addSuccessMessageByKey).toHaveBeenCalledWith('LBL_LOGOUT_SUCCESS');
        expect(messageMock.log).toHaveBeenCalledWith('Logout success');
        expect(routerMock.navigate).toHaveBeenCalledWith(['/Login']);
    });
});

