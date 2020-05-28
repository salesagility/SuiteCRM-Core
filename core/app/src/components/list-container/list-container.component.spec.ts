import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ApolloTestingModule} from 'apollo-angular/testing';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {ListcontainerUiComponent} from './list-container.component';
import {TableUiModule} from '@components/table/table.module';
import {WidgetUiModule} from '@components/widget/widget.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ThemeImagesFacade} from '@store/theme-images/theme-images.facade';
import {themeImagesMockData} from '@store/theme-images/theme-images.facade.spec.mock';
import {of} from 'rxjs';
import {take} from 'rxjs/operators';


describe('ListcontainerUiComponent', () => {
    let component: ListcontainerUiComponent;
    let fixture: ComponentFixture<ListcontainerUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TableUiModule,
                WidgetUiModule,
                AngularSvgIconModule,
                HttpClientTestingModule,
                BrowserAnimationsModule,
                ApolloTestingModule
            ],
            providers: [
                {
                    provide: ThemeImagesFacade, useValue: {
                        images$: of(themeImagesMockData).pipe(take(1))
                    }
                },
            ],
            declarations: [ListcontainerUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListcontainerUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
