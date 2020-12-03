import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {take} from 'rxjs/operators';
import {Component} from '@angular/core';

import {PaginationComponent} from './pagination.component';
import {PageSelection, PaginationCount, PaginationDataSource} from '@components/pagination/pagination.model';
import {LanguageStore} from '@store/language/language.store';
import {languageMockData} from '@store/language/language.store.spec.mock';
import {By} from '@angular/platform-browser';
import {ImageModule} from '@components/image/image.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {themeImagesMockData} from '@store/theme-images/theme-images.store.spec.mock';
import {HttpClientTestingModule} from '@angular/common/http/testing';

const pageSubject = new BehaviorSubject<PageSelection>(PageSelection.LAST);
const countSubject = new BehaviorSubject<PaginationCount>({
    pageFirst: 0, pageLast: 0, total: 0
});
let lastStatus = PageSelection.LAST;
const pageState: PaginationDataSource = {
    getPaginationCount: (): Observable<PaginationCount> => countSubject.asObservable(),
    changePage: (page: PageSelection): void => {
        pageSubject.next(page);
        lastStatus = page;
    }

} as PaginationDataSource;

@Component({
    selector: 'pagination-test-host-component',
    template: '<scrm-pagination [state]="state"></scrm-pagination>'
})
class PaginationTestHostComponent {
    state = pageState;
}

describe('PaginationComponent', () => {
    let testHostComponent: PaginationTestHostComponent;
    let testHostFixture: ComponentFixture<PaginationTestHostComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                PaginationTestHostComponent,
                PaginationComponent,
            ],
            imports: [
                ImageModule,
                AngularSvgIconModule,
                HttpClientTestingModule
            ],
            providers: [
                {
                    provide: LanguageStore, useValue: {
                        appListStrings$: of(languageMockData.appListStrings).pipe(take(1)),
                        appStrings$: of(languageMockData.appStrings).pipe(take(1))
                    }
                },
                {
                    provide: ThemeImagesStore, useValue: {
                        images$: of(themeImagesMockData).pipe(take(1))
                    }
                },
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(PaginationTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have previous page button', () => {
        expect(testHostFixture.debugElement.query(By.css('.pagination-previous'))).toBeTruthy();
    });

    it('should have first page button', () => {
        expect(testHostFixture.debugElement.query(By.css('.pagination-first'))).toBeTruthy();
    });

    it('should have last page button', () => {
        expect(testHostFixture.debugElement.query(By.css('.pagination-last'))).toBeTruthy();
    });

    it('should have next page button', () => {
        expect(testHostFixture.debugElement.query(By.css('.pagination-next'))).toBeTruthy();
    });

    it('should have page count', () => {
        expect(testHostFixture.debugElement.query(By.css('.pagination-count'))).toBeTruthy();
    });

    it('should trigger page change to previous page', waitForAsync(() => {
        const el = testHostFixture.debugElement;

        lastStatus = PageSelection.LAST;

        const link = el.query(By.css('.pagination-previous'));

        link.nativeElement.dispatchEvent(new Event('click'));
        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            expect(lastStatus).toEqual(PageSelection.PREVIOUS);
        });
    }));

    it('should trigger page change to first page', waitForAsync(() => {
        const el = testHostFixture.debugElement;

        lastStatus = PageSelection.LAST;

        const link = el.query(By.css('.pagination-first'));

        link.nativeElement.dispatchEvent(new Event('click'));
        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            expect(lastStatus).toEqual(PageSelection.FIRST);
        });
    }));

    it('should trigger page change to next page', waitForAsync(() => {
        const el = testHostFixture.debugElement;

        lastStatus = PageSelection.LAST;

        const link = el.query(By.css('.pagination-next'));

        link.nativeElement.dispatchEvent(new Event('click'));
        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            expect(lastStatus).toEqual(PageSelection.NEXT);
        });
    }));

    it('should trigger page change to last page', waitForAsync(() => {
        const el = testHostFixture.debugElement;

        lastStatus = PageSelection.FIRST;

        const link = el.query(By.css('.pagination-last'));

        link.nativeElement.dispatchEvent(new Event('click'));
        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            expect(lastStatus).toEqual(PageSelection.LAST);
        });
    }));
});
