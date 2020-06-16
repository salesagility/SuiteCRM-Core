import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TableBodyComponent} from './table-body.component';
import {CdkTableModule} from '@angular/cdk/table';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {Component} from '@angular/core';
import {ListViewStore} from '@store/list-view/list-view.store';
import {listviewStoreMock} from '@store/list-view/list-view.store.spec.mock';
import {MetadataStore} from '@store/metadata/metadata.store.service';
import {metadataMockData} from '@store/metadata/metadata.store.spec.mock';
import {LanguageStore} from '@store/language/language.store';
import {languageMockData} from '@store/language/language.store.spec.mock';
import {of} from 'rxjs';
import {take} from 'rxjs/operators';

@Component({
    selector: 'table-body-ui-test-host-component',
    template: '<scrm-table-body [module]="module"></scrm-table-body>'
})
class TableBodyUITestHostComponent {
    module = 'accounts';
}

describe('TablebodyUiComponent', () => {
    let testHostComponent: TableBodyUITestHostComponent;
    let testHostFixture: ComponentFixture<TableBodyUITestHostComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CdkTableModule,
                ApolloTestingModule,
            ],
            declarations: [TableBodyComponent, TableBodyUITestHostComponent],
            providers: [
                {provide: ListViewStore, useValue: listviewStoreMock},
                {
                    provide: MetadataStore, useValue: {
                        listMetadata$: of({
                            fields: metadataMockData.listView
                        }).pipe(take(1)),
                    }
                },
                {
                    provide: LanguageStore, useValue: {
                        vm$: of(languageMockData).pipe(take(1)),
                        appListStrings$: of(languageMockData.appListStrings).pipe(take(1)),
                        appStrings$: of(languageMockData.appStrings).pipe(take(1))
                    }
                },
            ],
        })
            .compileComponents();
    });

    beforeEach(async(() => {
        testHostFixture = TestBed.createComponent(TableBodyUITestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', async(() => {
        testHostFixture.whenStable().then(() => {
            expect(testHostComponent).toBeTruthy();
        });
    }));

    it('should have table body', async(() => {

        testHostFixture.whenStable().then(() => {
            const tableBodyElement = testHostFixture.nativeElement.querySelector('table');

            expect(testHostComponent).toBeTruthy();
            expect(tableBodyElement).toBeTruthy();
            expect(tableBodyElement.outerHTML).toContain('aria-describedby="table-body"');
        });
    }));
});
