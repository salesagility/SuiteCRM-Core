import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TableComponent} from './table.component';
import {TableHeaderModule} from '@components/table/table-header/table-header.module';
import {TableBodyModule} from '@components/table/table-body/table-body.module';
import {TableFooterModule} from '@components/table/table-footer/table-footer.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {ImageModule} from '@components/image/image.module';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {of} from 'rxjs';
import {themeImagesMockData} from '@store/theme-images/theme-images.store.spec.mock';
import {take} from 'rxjs/operators';
import {ListViewStore} from '@views/list/store/list-view/list-view.store';
import {listviewStoreMock} from '@views/list/store/list-view/list-view.store.spec.mock';
import {MetadataStore} from '@store/metadata/metadata.store.service';
import {metadataStoreMock} from '@store/metadata/metadata.store.spec.mock';
import {SortButtonModule} from '@components/sort-button/sort-button.module';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {RouterTestingModule} from '@angular/router/testing';
import {Component} from '@angular/core';
import {tableConfigMock} from '@components/table/table.component.spec.mock';

@Component({
    selector: 'table-test-host-component',
    template: '<scrm-table [config]="tableConfig"></scrm-table>'
})
class TableTestHostComponent {
    tableConfig = tableConfigMock;
}

describe('TableComponent', () => {
    let component: TableTestHostComponent;
    let fixture: ComponentFixture<TableTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TableHeaderModule,
                TableBodyModule,
                TableFooterModule,
                AngularSvgIconModule,
                HttpClientTestingModule,
                ApolloTestingModule,
                ImageModule,
                SortButtonModule,
                RouterTestingModule
            ],
            declarations: [TableComponent],
            providers: [
                {
                    provide: ListViewStore, useValue: listviewStoreMock
                },
                {
                    provide: LanguageStore, useValue: languageStoreMock
                },
                {
                    provide: ThemeImagesStore, useValue: {
                        images$: of(themeImagesMockData).pipe(take(1))
                    }
                },
                {
                    provide: MetadataStore, useValue: metadataStoreMock
                },
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TableTestHostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
