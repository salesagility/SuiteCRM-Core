import {getTestBed, TestBed} from '@angular/core/testing';
import {ThemeImagesFacade} from '@base/facades/theme-images/theme-images.facade';
import {themeImagesFacadeMock, themeImagesMockData} from '@base/facades/theme-images/theme-images.facade.spec.mock';

describe('ThemeImages Facade', () => {
    const service: ThemeImagesFacade = themeImagesFacadeMock;

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('#load',
        (done: DoneFn) => {

            service.load('suite8').subscribe(data => {
                expect(data).toEqual(jasmine.objectContaining(themeImagesMockData));
                done();
            });
        });
});

