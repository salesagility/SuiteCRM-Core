import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TableUiComponent} from './table.component';
import {TableheaderUiModule} from '@components/table/table-header/table-header.module';
import {TablebodyUiModule} from '@components/table/table-body/table-body.module';
import {TablefooterUiModule} from '@components/table/table-footer/table-footer.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {ImageModule} from '@components/image/image.module';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {of} from 'rxjs';
import {themeImagesMockData} from '@store/theme-images/theme-images.store.spec.mock';
import {take} from 'rxjs/operators';
import {ListViewStore} from '@store/list-view/list-view.store';
import {listviewStoreMock} from '@store/list-view/list-view.store.spec.mock';
import {MetadataStore} from '@store/metadata/metadata.store.service';
import {metadataMockData} from '@store/metadata/metadata.store.spec.mock';
import {SortButtonModule} from '@components/sort-button/sort-button.module';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';

describe('TableUiComponent', () => {
    let component: TableUiComponent;
    let fixture: ComponentFixture<TableUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TableheaderUiModule,
                TablebodyUiModule,
                TablefooterUiModule,
                AngularSvgIconModule,
                HttpClientTestingModule,
                ApolloTestingModule,
                ImageModule,
                SortButtonModule
            ],
            declarations: [TableUiComponent],
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
                    provide: MetadataStore, useValue: {
                        listMetadata$: of({
                            fields: metadataMockData.listView
                        }).pipe(take(1)),
                    }
                },
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TableUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
