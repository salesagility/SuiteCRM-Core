import {getTestBed, TestBed} from '@angular/core/testing';
import {AppStateStore} from '@store/app-state/app-state.store';
import {appStateStoreMock} from '@store/app-state/app-state.store.spec.mock';
import {take} from 'rxjs/operators';

describe('AppState Store', () => {
    let injector: TestBed;
    const service: AppStateStore = appStateStoreMock;

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

