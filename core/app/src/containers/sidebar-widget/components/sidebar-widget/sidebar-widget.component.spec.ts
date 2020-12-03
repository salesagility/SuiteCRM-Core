import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {Component} from '@angular/core';
import {ViewContext} from '@app-common/views/view.model';
import {WidgetMetadata} from '@app-common/metadata/widget.metadata';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {CommonModule} from '@angular/common';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {FieldModule} from '@fields/field.module';
import {RouterTestingModule} from '@angular/router/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {SidebarWidgetModule} from '@containers/sidebar-widget/components/sidebar-widget/sidebar-widget.module';
import {ChartDataStoreFactory} from '@store/chart-data/chart-data.store.factory';
import {chartDataStoreFactoryMock} from '@store/chart-data/chart-data.store.spec.mock';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';


@Component({
    selector: 'sidebar-widget-test-host-component',
    template: '<scrm-sidebar-widget [type]="type" [context]="context" [config]="config"></scrm-sidebar-widget>'
})
class SidebarWidgetHostComponent {
    type = 'chart';

    context: ViewContext = {
        module: 'accounts',
        id: '123'
    };

    config: WidgetMetadata = {
        type: 'chart',
        options: {
            toggle: false,
            headerTitle: true,
            charts: [
                {
                    chartKey: 'accounts-past-years-closed-opportunity-amounts',
                    chartType: 'line-chart',
                    statisticsType: 'accounts-past-years-closed-opportunity-amounts',
                    labelKey: 'LBL_CLOSED_PER_YEAR',
                    chartOptions: []
                },
            ],
        }
    };
}

describe('SideBarWidgetComponent', () => {
    let testHostComponent: SidebarWidgetHostComponent;
    let testHostFixture: ComponentFixture<SidebarWidgetHostComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                SidebarWidgetHostComponent,
            ],
            imports: [
                SidebarWidgetModule,
                BrowserDynamicTestingModule,
                FieldModule,
                CommonModule,
                RouterTestingModule,
                ApolloTestingModule,
                NoopAnimationsModule
            ],
            providers: [
                {provide: LanguageStore, useValue: languageStoreMock},
                {provide: ChartDataStoreFactory, useValue: chartDataStoreFactoryMock},
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(SidebarWidgetHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have statistics widget', () => {
        expect(testHostComponent).toBeTruthy();

        const topWidget = testHostFixture.nativeElement.getElementsByTagName('scrm-sidebar-widget')[0];

        expect(topWidget).toBeTruthy();
    });
});
