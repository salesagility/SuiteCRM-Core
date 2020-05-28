import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TableUiComponent} from './table.component';
import {TableheaderUiModule} from '@components/table/table-header/table-header.module';
import {TablebodyUiModule} from '@components/table/table-body/table-body.module';
import {TablefooterUiModule} from '@components/table/table-footer/table-footer.module';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {ImageModule} from '@components/image/image.module';
import {ThemeImagesFacade} from '@store/theme-images/theme-images.facade';
import {of} from 'rxjs';
import {themeImagesMockData} from '@store/theme-images/theme-images.facade.spec.mock';
import {take} from 'rxjs/operators';

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
                ImageModule
            ],
            declarations: [TableUiComponent],
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
        fixture = TestBed.createComponent(TableUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
