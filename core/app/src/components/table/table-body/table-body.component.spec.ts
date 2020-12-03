import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {TableBodyComponent} from './table-body.component';
import {CdkTableModule} from '@angular/cdk/table';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {Component} from '@angular/core';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {FieldModule} from '@fields/field.module';
import {SortButtonModule} from '@components/sort-button/sort-button.module';
import {RouterTestingModule} from '@angular/router/testing';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {themeImagesStoreMock} from '@store/theme-images/theme-images.store.spec.mock';
import {tableConfigMock} from '@components/table/table.component.spec.mock';

@Component({
    selector: 'table-body-test-host-component',
    template: '<scrm-table-body [config]="tableConfig"></scrm-table-body>'
})
class TableBodyTestHostComponent {
    tableConfig = tableConfigMock;
}

describe('TableBodyComponent', () => {
    let testHostComponent: TableBodyTestHostComponent;
    let testHostFixture: ComponentFixture<TableBodyTestHostComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CdkTableModule,
                ApolloTestingModule,
                FieldModule,
                SortButtonModule,
                RouterTestingModule
            ],
            declarations: [TableBodyComponent, TableBodyTestHostComponent],
            providers: [
                {provide: LanguageStore, useValue: languageStoreMock},
                {provide: ThemeImagesStore, useValue: themeImagesStoreMock},
            ],
        })
            .compileComponents();
    });

    beforeEach(waitForAsync(() => {
        testHostFixture = TestBed.createComponent(TableBodyTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', waitForAsync(() => {
        testHostFixture.whenStable().then(() => {
            expect(testHostComponent).toBeTruthy();
        });
    }));

    it('should have table body', waitForAsync(() => {

        testHostFixture.whenStable().then(() => {
            const tableBodyElement = testHostFixture.nativeElement.querySelector('table');

            expect(testHostComponent).toBeTruthy();
            expect(tableBodyElement).toBeTruthy();
            expect(tableBodyElement.outerHTML).toContain('aria-describedby="table-body"');
        });
    }));
});
