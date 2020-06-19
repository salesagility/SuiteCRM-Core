import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
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

@Component({
    selector: 'list-filter-host-component',
    template: '<scrm-list-filter></scrm-list-filter>'
})
class ListFilterTestHostComponent {
}

describe('ListFilterComponent', () => {
    let testHostComponent: ListFilterTestHostComponent;
    let testHostFixture: ComponentFixture<ListFilterTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ListFilterTestHostComponent,
                ListFilterComponent,
            ],
            imports: [
                CloseButtonModule,
                ButtonModule,
                PanelModule,
                DropdownButtonModule,
                FieldGridModule,
            ],
            providers: [
                {provide: ListViewStore, useValue: listviewStoreMock},
                {provide: MetadataStore, useValue: metadataStoreMock},
                {provide: LanguageStore, useValue: languageStoreMock},
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(ListFilterTestHostComponent);
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

        expect(element.nativeElement.textContent).toContain('Advanced Filter');
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
        expect(testHostFixture.debugElement.queryAll(By.css('.form-row')).length).toEqual(5);
        expect(testHostFixture.debugElement.queryAll(By.css('.form-group')).length).toEqual(15);
        expect(testHostFixture.debugElement.queryAll(By.css('input')).length).toEqual(12);
        expect(testHostFixture.debugElement.queryAll(By.css('label')).length).toEqual(12);
        expect(testHostFixture.debugElement.query(By.css('.clear-filters-button')).nativeElement).toBeTruthy();
        expect(testHostFixture.debugElement.query(By.css('.filter-button')).nativeElement).toBeTruthy();
    });
});
