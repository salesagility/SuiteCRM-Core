import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {
    BulkActionDataSource,
    BulkActionMenuComponent,
    SelectionDataSource,
    SelectionStatus
} from './bulk-action-menu.component';
import {By} from '@angular/platform-browser';
import {LanguageStore} from '@store/language/language.store';
import {languageMockData} from '@store/language/language.store.spec.mock';
import {shareReplay, take} from 'rxjs/operators';
import {ButtonModule} from '@components/button/button.module';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {DropdownButtonModule} from '@components/dropdown-button/dropdown-button.module';
import {BulkActionsMap} from '@store/metadata/metadata.store.service';


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

let lastAction = '';
const actionSource: BulkActionDataSource = {
    getBulkActions: (): Observable<BulkActionsMap> => of({
        delete: {
            key: 'delete',
            labelKey: 'LBL_DELETE',
            params: {
                min: 1,
                max: 5
            },
            acl: [
                'delete'
            ]
        },
        export: {
            key: 'export',
            labelKey: 'LBL_EXPORT',
            params: {
                min: 1,
                max: 5
            },
            acl: [
                'export'
            ]
        },
        merge: {
            key: 'merge',
            labelKey: 'LBL_MERGE_DUPLICATES',
            params: {
                min: 1,
                max: 5
            },
            acl: [
                'edit',
                'delete'
            ]
        },
        massupdate: {
            key: 'massupdate',
            labelKey: 'LBL_MASS_UPDATE',
            params: {
                min: 1,
                max: 5
            },
            acl: [
                'massupdate'
            ]
        }
    } as BulkActionsMap).pipe(shareReplay(1)),
    executeBulkAction: (action: string): void => {
        lastAction = action;
    }
};

@Component({
    selector: 'bulk-action-menu-test-host-component',
    template: '<scrm-bulk-action-menu [selectionSource]="state" [actionSource]="actionSource"></scrm-bulk-action-menu>'
})
class BulkActionMenuTestHostComponent {
    state = selectionState;
    actionSource = actionSource;
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
            imports: [
                DropdownButtonModule,
                ButtonModule,
                NgbDropdownModule
            ],
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


    it('should have delete action', async(() => {
        const el = testHostFixture.debugElement;

        const deleteAction = el.query(By.css('.delete-bulk-action'));

        expect(deleteAction.nativeElement).toBeTruthy();
        expect(deleteAction.nativeElement.textContent).toContain('Delete');

        deleteAction.nativeElement.click();

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {

            expect(lastAction).toEqual('delete');
        });
    }));

    it('should have export action', async(() => {
        const el = testHostFixture.debugElement;

        const exportAction = el.query(By.css('.export-bulk-action'));

        expect(exportAction.nativeElement).toBeTruthy();
        expect(exportAction.nativeElement.textContent).toContain('Export');

        exportAction.nativeElement.click();

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {

            expect(lastAction).toEqual('export');
        });
    }));

    it('should have merge action', async(() => {
        const el = testHostFixture.debugElement;

        const mergeAction = el.query(By.css('.merge-bulk-action'));

        expect(mergeAction.nativeElement).toBeTruthy();
        expect(mergeAction.nativeElement.textContent).toContain('Merge');

        mergeAction.nativeElement.click();

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {

            expect(lastAction).toEqual('merge');
        });
    }));

    it('should have mass update action', async(() => {
        const el = testHostFixture.debugElement;

        const massUpdateAction = el.query(By.css('.massupdate-bulk-action'));

        expect(massUpdateAction.nativeElement).toBeTruthy();
        expect(massUpdateAction.nativeElement.textContent).toContain('Mass Update');
        massUpdateAction.nativeElement.click();

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {

            expect(lastAction).toEqual('massupdate');
        });
    }));

});
