import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WidgetPanelComponent} from './widget-panel.component';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {ChartModule} from '@components/chart/components/chart/chart.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {ThemeImagesStore} from '@store/theme-images/theme-images.store';
import {of} from 'rxjs';
import {themeImagesMockData} from '@store/theme-images/theme-images.store.spec.mock';
import {take} from 'rxjs/operators';
import {ImageModule} from '@components/image/image.module';
import {ListViewStore} from '@store/list-view/list-view.store';
import {listviewStoreMock} from '@store/list-view/list-view.store.spec.mock';

describe('WidgetPanelComponent', () => {
    let component: WidgetPanelComponent;
    let fixture: ComponentFixture<WidgetPanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AngularSvgIconModule,
                ChartModule,
                HttpClientTestingModule,
                BrowserAnimationsModule,
                ApolloTestingModule,
                ImageModule
            ],
            declarations: [WidgetPanelComponent],
            providers: [
                {provide: ListViewStore, useValue: listviewStoreMock},
                {provide: ThemeImagesStore, useValue: {images$: of(themeImagesMockData).pipe(take(1))}},
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WidgetPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
