import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WidgetUiComponent} from './widget.component';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {ChartUiModule} from '@components/chart/chart.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {ThemeImagesFacade} from '@base/facades/theme-images/theme-images.facade';
import {of} from 'rxjs';
import {themeImagesMockData} from '@base/facades/theme-images/theme-images.facade.spec.mock';
import {take} from 'rxjs/operators';
import {ImageModule} from '@components/image/image.module';

describe('WidgetUiComponent', () => {
    let component: WidgetUiComponent;
    let fixture: ComponentFixture<WidgetUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AngularSvgIconModule,
                ChartUiModule,
                HttpClientTestingModule,
                BrowserAnimationsModule,
                ApolloTestingModule,
                ImageModule
            ],
            declarations: [WidgetUiComponent],
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
        fixture = TestBed.createComponent(WidgetUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
