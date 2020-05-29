import {getTestBed, TestBed} from '@angular/core/testing';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {themeImagesStoreMock, themeImagesMockData} from '@store/theme-images/theme-images.store.spec.mock';

describe('ThemeImages Store', () => {
    const service: ThemeImagesStore = themeImagesStoreMock;

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

