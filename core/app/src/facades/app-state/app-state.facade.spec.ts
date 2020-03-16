import {getTestBed, TestBed} from '@angular/core/testing';
import {AppStateFacade} from '@base/facades/app-state/app-state.facade';
import {appStateFacadeMock} from '@base/facades/app-state/app-state.facade.spec.mock';

describe('AppState Facade', () => {
    let injector: TestBed;
    const service: AppStateFacade = appStateFacadeMock;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        injector = getTestBed();
    });

    it('#updateLoading',
        (done: DoneFn) => {
            service.updateLoading(true);
            service.loading$.subscribe(loading => {
                expect(loading).toEqual(true);
                done();
            });
        });
});

