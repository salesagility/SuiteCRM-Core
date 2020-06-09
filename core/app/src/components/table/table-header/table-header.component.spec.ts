import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TableHeaderComponent} from './table-header.component';
import {PaginationModule} from '@components/pagination/pagination.module';
import {BulkActionMenuModule} from '@components/bulk-action-menu/bulk-action-menu.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {ImageModule} from '@components/image/image.module';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {of} from 'rxjs';
import {themeImagesMockData} from '@store/theme-images/theme-images.store.spec.mock';
import {take} from 'rxjs/operators';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {ListViewStore} from '@store/list-view/list-view.store';
import {listviewStoreMock} from '@store/list-view/list-view.store.spec.mock';

describe('TableheaderUiComponent', () => {
    let component: TableHeaderComponent;
    let fixture: ComponentFixture<TableHeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                PaginationModule,
                BulkActionMenuModule,
                AngularSvgIconModule,
                HttpClientTestingModule,
                ApolloTestingModule,
                ImageModule
            ],
            declarations: [TableHeaderComponent],
            providers: [
                {
                    provide: ThemeImagesStore, useValue: {
                        images$: of(themeImagesMockData).pipe(take(1))
                    }
                },
                {provide: LanguageStore, useValue: languageStoreMock},
                {
                    provide: ListViewStore, useValue: listviewStoreMock
                },
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TableHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
