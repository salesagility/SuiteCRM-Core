import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {BulkActionMenuComponent, SelectionDataSource, SelectionStatus} from './bulk-action-menu.component';
import {By} from '@angular/platform-browser';
import {LanguageStore} from '@store/language/language.store';
import {languageMockData} from '@store/language/language.store.spec.mock';
import {take} from 'rxjs/operators';


const selectionSubject = new BehaviorSubject<SelectionStatus>(SelectionStatus.NONE);
const countSubject = new BehaviorSubject<number>(0);
let lastStatus = SelectionStatus.NONE;
const selectionState: SelectionDataSource = {
    getSelectionStatus: (): Observable<SelectionStatus> => selectionSubject.asObservable(),
    getSelectedCount: (): Observable<number> => countSubject.asObservable(),
    updateSelection: (state: SelectionStatus) => {
        selectionSubject.next(state);
        lastStatus = state;
    }
} as SelectionDataSource;

@Component({
    selector: 'bulk-action-menu-test-host-component',
    template: '<scrm-bulk-action-menu [state]="state"></scrm-bulk-action-menu>'
})
class BulkActionMenuTestHostComponent {
    state = selectionState;
}

describe('BulkActionMenuComponent', () => {
    let testHostComponent: BulkActionMenuTestHostComponent;
    let testHostFixture: ComponentFixture<BulkActionMenuTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BulkActionMenuTestHostComponent,
                BulkActionMenuComponent,
            ],
            imports: [],
            providers: [
                {
                    provide: LanguageStore, useValue: {
                        appListStrings$: of(languageMockData.appListStrings).pipe(take(1)),
                        appStrings$: of(languageMockData.appStrings).pipe(take(1))
                    }
                },
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(BulkActionMenuTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have selection group', () => {
        expect(testHostFixture.debugElement.query(By.css('.select-action-group'))).toBeTruthy();
    });

    it('should have number of selected items', () => {
        expect(testHostFixture.debugElement.query(By.css('.bulk-action-selected-number'))).toBeTruthy();
    });

    it('should have selection dropdown button', () => {
        const el = testHostFixture.debugElement;

        expect(el.query(By.css('.select-action-group .bulk-action-button'))).toBeTruthy();
        expect(el.query(By.css('.select-action-group .bulk-action-button .checkbox-container'))).toBeTruthy();
        expect(el.query(By.css('.select-action-group .dropdown-menu'))).toBeTruthy();

        const selectAll = el.query(By.css('.select-action-group .dropdown-menu .select-all'));
        const selectPage = el.query(By.css('.select-action-group .dropdown-menu .select-page'));
        const deSelectAll = el.query(By.css('.select-action-group .dropdown-menu .deselect-all'));

        expect(selectAll).toBeTruthy();
        expect(selectAll.nativeElement.text).toContain('Select All');
        expect(selectPage).toBeTruthy();
        expect(selectPage.nativeElement.text).toContain('Select This page');
        expect(deSelectAll).toBeTruthy();
        expect(deSelectAll.nativeElement.text).toContain('Deselect All');
    });

    it('should select all', async(() => {
        const el = testHostFixture.debugElement;

        lastStatus = SelectionStatus.NONE;

        const link = el.query(By.css('.select-action-group .dropdown-menu .select-all'));

        link.nativeElement.click();
        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            expect(lastStatus).toEqual(SelectionStatus.ALL);

            const checkbox = el.query(By.css('.select-action-group .checkbox-container input'));

            expect(checkbox).toBeTruthy();
            expect(checkbox.nativeElement.checked).toEqual(true);
            expect(checkbox.nativeElement.indeterminate).toEqual(false);
        });
    }));

    it('should select page', async(() => {
        const el = testHostFixture.debugElement;

        lastStatus = SelectionStatus.NONE;

        const link = el.query(By.css('.select-action-group .dropdown-menu .select-page'));

        link.nativeElement.click();
        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            expect(lastStatus).toEqual(SelectionStatus.PAGE);

            const checkbox = el.query(By.css('.select-action-group .checkbox-container input'));

            expect(checkbox).toBeTruthy();
            expect(checkbox.nativeElement.checked).toEqual(false);
            expect(checkbox.nativeElement.indeterminate).toEqual(true);
        });
    }));

    it('should deselect all', async(() => {
        const el = testHostFixture.debugElement;

        lastStatus = SelectionStatus.ALL;

        const link = el.query(By.css('.select-action-group .dropdown-menu .deselect-all'));

        link.nativeElement.click();
        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            expect(lastStatus).toEqual(SelectionStatus.NONE);

            const checkbox = el.query(By.css('.select-action-group .checkbox-container input'));

            expect(checkbox).toBeTruthy();
            expect(checkbox.nativeElement.checked).toEqual(false);
            expect(checkbox.nativeElement.indeterminate).toEqual(false);
        });
    }));

    it('should toggle select all on checkbox click', async(() => {
        const el = testHostFixture.debugElement;

        lastStatus = SelectionStatus.NONE;
        selectionSubject.next(SelectionStatus.NONE);
        const checkbox = el.query(By.css('.select-action-group .checkbox-container input'));
        checkbox.nativeElement.checked = false;
        checkbox.nativeElement.indeterminate = false;
        testHostFixture.detectChanges();

        checkbox.nativeElement.click();
        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            expect(lastStatus).toEqual(SelectionStatus.ALL);

            expect(checkbox).toBeTruthy();
            expect(checkbox.nativeElement.checked).toEqual(true);
            expect(checkbox.nativeElement.indeterminate).toEqual(false);

            const updatedCheckbox = el.query(By.css('.select-action-group .checkbox-container input'));

            updatedCheckbox.nativeElement.click();
            testHostFixture.detectChanges();
            testHostFixture.whenStable().then(() => {
                expect(lastStatus).toEqual(SelectionStatus.NONE);

                expect(updatedCheckbox).toBeTruthy();
                expect(updatedCheckbox.nativeElement.checked).toEqual(false);
                expect(updatedCheckbox.nativeElement.indeterminate).toEqual(false);
            });
        });
    }));

});
