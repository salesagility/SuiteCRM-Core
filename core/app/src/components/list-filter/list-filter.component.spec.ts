import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CloseButtonModule} from '@components/close-button/close-button.module';
import {ButtonModule} from '@components/button/button.module';
import {By} from '@angular/platform-browser';
import {PanelModule} from '@components/panel/panel.module';
import {ListFilterComponent} from '@components/list-filter/list-filter.component';
import {MetadataStore} from '@store/metadata/metadata.store.service';
import {metadataStoreMock} from '@store/metadata/metadata.store.spec.mock';
import {ListViewStore} from '@store/list-view/list-view.store';
import {listviewStoreMock} from '@store/list-view/list-view.store.spec.mock';
import {DropdownButtonModule} from '@components/dropdown-button/dropdown-button.module';
import {FieldGridModule} from '@components/field-grid/field-grid.module';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {RouterTestingModule} from '@angular/router/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';

describe('ListFilterComponent', () => {
    let testHostComponent: ListFilterComponent;
    let testHostFixture: ComponentFixture<ListFilterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ListFilterComponent,
            ],
            imports: [
                CloseButtonModule,
                ButtonModule,
                PanelModule,
                DropdownButtonModule,
                FieldGridModule,
                RouterTestingModule,
                ApolloTestingModule
            ],
            providers: [
                {provide: ListViewStore, useValue: listviewStoreMock},
                {provide: MetadataStore, useValue: metadataStoreMock},
                {provide: LanguageStore, useValue: languageStoreMock},
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(ListFilterComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have header', () => {
        expect(testHostFixture.debugElement.query(By.css('.card-header')).nativeElement).toBeTruthy();
    });

    it('should have body', () => {
        expect(testHostFixture.debugElement.query(By.css('.card-body')).nativeElement).toBeTruthy();
    });

    it('should have header title', () => {

        const element = testHostFixture.debugElement.query(By.css('.card-header'));

        expect(element.nativeElement.textContent).toContain('My Filters');
    });

    it('should have close icon', () => {

        expect(testHostComponent).toBeTruthy();
        const element = testHostFixture.debugElement.query(By.css('.card-header'));
        const button = element.nativeElement.querySelector('button');

        expect(button).toBeTruthy();
    });

    it('should have configurable buttons', () => {

        expect(testHostComponent).toBeTruthy();
        expect(testHostFixture.debugElement.query(By.css('.saved-filters-button')).nativeElement).toBeTruthy();
        expect(testHostFixture.debugElement.query(By.css('.quick-filter-button')).nativeElement).toBeTruthy();
    });

    it('should have grid list', () => {

        expect(testHostComponent).toBeTruthy();
        expect(testHostFixture.debugElement.query(By.css('scrm-field-grid')).nativeElement).toBeTruthy();
        expect(testHostFixture.debugElement.query(By.css('form')).nativeElement).toBeTruthy();
        expect(testHostFixture.debugElement.query(By.css('.clear-filters-button')).nativeElement).toBeTruthy();
        expect(testHostFixture.debugElement.query(By.css('.filter-button')).nativeElement).toBeTruthy();
    });

    it('should allow to insert filter value', async(() => {

        expect(testHostFixture.debugElement.query(By.css('scrm-field-grid')).nativeElement).toBeTruthy();

        const input = testHostFixture.debugElement.query(By.css('input')).nativeElement;
        input.value = 'test';
        input.dispatchEvent(new Event('input'));

        expect(input).toBeTruthy();

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {

            expect(testHostComponent.searchCriteria.filters.name).toBeTruthy();
            expect(testHostComponent.searchCriteria.filters.name.operator).toEqual('=');
            expect(testHostComponent.searchCriteria.filters.name.values).toEqual(['test']);
        });
    }));

    it('should allow to applyFilter', async(() => {

        expect(testHostFixture.debugElement.query(By.css('scrm-field-grid')).nativeElement).toBeTruthy();

        const input = testHostFixture.debugElement.query(By.css('input')).nativeElement;
        const filterButton = testHostFixture.debugElement.query(By.css('.filter-button')).nativeElement;

        input.value = 'test';
        input.dispatchEvent(new Event('input'));

        expect(input).toBeTruthy();

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {

            filterButton.click();

            testHostFixture.detectChanges();
            testHostFixture.whenStable().then(() => {
                expect(testHostComponent.searchCriteria.filters.name).toBeTruthy();
                expect(testHostComponent.searchCriteria.filters.name.operator).toEqual('=');
                expect(testHostComponent.searchCriteria.filters.name.values).toEqual(['test']);

                expect(listviewStoreMock.showFilters).toEqual(false);
                expect(listviewStoreMock.recordList.criteria.filters.name.operator).toEqual('=');
                expect(listviewStoreMock.recordList.criteria.filters.name.values).toEqual(['test']);
            });
        });
    }));

    it('should allow to clear filter', async(() => {

        expect(testHostFixture.debugElement.query(By.css('scrm-field-grid')).nativeElement).toBeTruthy();

        const input = testHostFixture.debugElement.query(By.css('input')).nativeElement;
        const filterButton = testHostFixture.debugElement.query(By.css('.filter-button')).nativeElement;
        const clearButton = testHostFixture.debugElement.query(By.css('.clear-filters-button')).nativeElement;

        input.value = 'test';
        input.dispatchEvent(new Event('input'));

        expect(input).toBeTruthy();

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {

            filterButton.click();
            clearButton.click();

            testHostFixture.detectChanges();
            testHostFixture.whenStable().then(() => {

                expect(testHostComponent.searchCriteria).toBeTruthy();
                expect(testHostComponent.searchCriteria.filters.name.operator).toEqual('');
                expect(testHostComponent.searchCriteria.filters.name.values).toEqual([]);

                expect(listviewStoreMock.recordList.criteria).toEqual({filters: {}});
            });
        });
    }));
});
