import {getTestBed, TestBed} from '@angular/core/testing';
import {AppStateFacade} from '@store/app-state/app-state.facade';
import {appStateFacadeMock} from '@store/app-state/app-state.facade.spec.mock';
import {take} from 'rxjs/operators';

describe('AppState Facade', () => {
    let injector: TestBed;
    const service: AppStateFacade = appStateFacadeMock;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        injector = getTestBed();
    });

    it('#updateLoading', () => {
        service.updateLoading('test', true);
        service.loading$.pipe(take(1)).subscribe(loading => {
            expect(loading).toEqual(true);
        });
    });

    it('#setModule', () => {
        service.setModule('accounts');
        service.module$.pipe(take(1)).subscribe(module => {
            expect(module).toEqual('accounts');
        }).unsubscribe();
    });

    it('#setView', () => {
        service.setView('record');
        service.view$.pipe(take(1)).subscribe(view => {
            expect(view).toEqual('record');
        }).unsubscribe();
    });
});

