import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TableFooterComponent} from './table-footer.component';
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

describe('TablefooterUiComponent', () => {
    let component: TableFooterComponent;
    let fixture: ComponentFixture<TableFooterComponent>;

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
            declarations: [TableFooterComponent],
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
        fixture = TestBed.createComponent(TableFooterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
