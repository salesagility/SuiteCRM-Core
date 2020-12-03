import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {SortButtonComponent} from './sort-button.component';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Component} from '@angular/core';
import {ImageModule} from '@components/image/image.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {By} from '@angular/platform-browser';
import {SortDirection, SortDirectionDataSource} from '@components/sort-button/sort-button.model';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {themeImagesMockData} from '@store/theme-images/theme-images.store.spec.mock';
import {take} from 'rxjs/operators';

const sortDirectionSubject = new BehaviorSubject<SortDirection>(SortDirection.NONE);
let lastDirection = SortDirection.NONE;
const sortDirectionState: SortDirectionDataSource = {
    getSortDirection: (): Observable<SortDirection> => sortDirectionSubject.asObservable(),
    changeSortDirection: (direction: SortDirection): void => {
        sortDirectionSubject.next(direction);
        lastDirection = direction;
    }
} as SortDirectionDataSource;

@Component({
    selector: 'sort-button-test-host-component',
    template: '<scrm-sort-button [state]="state"></scrm-sort-button>'
})
class SortButtonTestHostComponent {
    state = sortDirectionState;
}

describe('SortButtonComponent', () => {
    let testHostComponent: SortButtonTestHostComponent;
    let testHostFixture: ComponentFixture<SortButtonTestHostComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                SortButtonTestHostComponent,
                SortButtonComponent,
            ],
            imports: [
                ImageModule,
                AngularSvgIconModule,
                HttpClientTestingModule,
            ],
            providers: [
                {
                    provide: ThemeImagesStore, useValue: {
                        images$: of(themeImagesMockData).pipe(take(1))
                    }
                }
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(SortButtonTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have sort button', () => {
        expect(testHostFixture.debugElement.query(By.css('.sort-button'))).toBeTruthy();
    });

    it('should have sort icon', () => {
        expect(testHostFixture.debugElement.query(By.css('.sort-icon'))).toBeTruthy();
    });

    it('should change selection to descending', waitForAsync(() => {
        const el = testHostFixture.debugElement;

        sortDirectionSubject.next(SortDirection.NONE);
        lastDirection = SortDirection.NONE;

        const link = el.query(By.css('.sort-button'));

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {

            link.nativeElement.click();
            link.nativeElement.dispatchEvent(new Event('click'));
            testHostFixture.detectChanges();

            testHostFixture.whenStable().then(() => {
                expect(lastDirection).toEqual(SortDirection.DESC);
            });
        });


    }));

    it('should change selection to ascending', waitForAsync(() => {
        const el = testHostFixture.debugElement;

        lastDirection = SortDirection.DESC;
        sortDirectionSubject.next(lastDirection);

        const link = el.query(By.css('.sort-button'));

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {

            link.nativeElement.click();
            link.nativeElement.dispatchEvent(new Event('click'));
            testHostFixture.detectChanges();

            testHostFixture.whenStable().then(() => {
                expect(lastDirection).toEqual(SortDirection.ASC);
            });
        });

    }));

    it('should change selection to none', waitForAsync(() => {
        const el = testHostFixture.debugElement;

        lastDirection = SortDirection.ASC;
        sortDirectionSubject.next(SortDirection.ASC);

        const link = el.query(By.css('.sort-button'));

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {

            link.nativeElement.click();
            link.nativeElement.dispatchEvent(new Event('click'));
            testHostFixture.detectChanges();

            testHostFixture.whenStable().then(() => {
                expect(lastDirection).toEqual(SortDirection.NONE);
            });
        });


    }));
});
