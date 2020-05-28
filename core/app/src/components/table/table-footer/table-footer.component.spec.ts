import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TablefooterUiComponent} from './table-footer.component';
import {PaginationUiModule} from '@components/pagination/pagination.module';
import {BulkactionmenuUiModule} from '@components/bulk-action-menu/bulk-action-menu.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {ImageModule} from '@components/image/image.module';
import {ThemeImagesFacade} from '@store/theme-images/theme-images.facade';
import {of} from 'rxjs';
import {themeImagesMockData} from '@store/theme-images/theme-images.facade.spec.mock';
import {take} from 'rxjs/operators';

describe('TablefooterUiComponent', () => {
    let component: TablefooterUiComponent;
    let fixture: ComponentFixture<TablefooterUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                PaginationUiModule,
                BulkactionmenuUiModule,
                AngularSvgIconModule,
                HttpClientTestingModule,
                ApolloTestingModule,
                ImageModule
            ],
            declarations: [TablefooterUiComponent],
            providers: [
                {
                    provide: ThemeImagesFacade, useValue: {
                        images$: of(themeImagesMockData).pipe(take(1))
                    }
                },
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TablefooterUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
