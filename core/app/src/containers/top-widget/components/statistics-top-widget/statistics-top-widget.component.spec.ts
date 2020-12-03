import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {StatisticsTopWidgetComponent} from './statistics-top-widget.component';
import {Component} from '@angular/core';
import {ViewContext} from '@app-common/views/view.model';
import {WidgetMetadata} from '@app-common/metadata/widget.metadata';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {topWidgetStatisticsFactoryMock} from './statistics-top-widget.component.spec.mock';
import {SingleValueStatisticsStoreFactory} from '@store/single-value-statistics/single-value-statistics.store.factory';
import {FieldModule} from '@fields/field.module';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {CommonModule} from '@angular/common';
import {RouterTestingModule} from '@angular/router/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';

@Component({
    selector: 'statistics-top-widget-test-host-component',
    template: '<scrm-statistics-top-widget [context]="context" [config]="config"></scrm-statistics-top-widget>'
})
class StatisticsTopWidgetHostComponent {
    context: ViewContext = {
        module: 'accounts',
        id: '123'
    };

    config: WidgetMetadata = {
        type: 'statistics',
        options: {
            statistics: [
                {
                    labelKey: 'LBL_AVERAGE_CLOSED_WON_PER_YEAR',
                    type: 'accounts-won-opportunity-amount-by-year'
                },
                {
                    labelKey: 'LBL_OPPORTUNITIES_TOTAL',
                    type: 'opportunities'
                },
            ],
        }
    };
}

describe('StatisticsTopWidgetComponent', () => {
    let testHostComponent: StatisticsTopWidgetHostComponent;
    let testHostFixture: ComponentFixture<StatisticsTopWidgetHostComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                StatisticsTopWidgetHostComponent,
                StatisticsTopWidgetComponent,
            ],
            imports: [
                BrowserDynamicTestingModule,
                FieldModule,
                CommonModule,
                RouterTestingModule,
                ApolloTestingModule
            ],
            providers: [
                {provide: LanguageStore, useValue: languageStoreMock},
                {provide: SingleValueStatisticsStoreFactory, useValue: topWidgetStatisticsFactoryMock},
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(StatisticsTopWidgetHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have statistics', () => {
        expect(testHostComponent).toBeTruthy();

        const widget = testHostFixture.nativeElement.getElementsByTagName('scrm-statistics-top-widget')[0];

        expect(widget).toBeTruthy();

        const widgetBar = widget.getElementsByClassName('widget-bar').item(0);

        expect(widgetBar).toBeTruthy();

        const entries = widgetBar.getElementsByClassName('widget-bar-entry');

        expect(entries).toBeTruthy();
        expect(entries.length).toEqual(2);

        const averageSpend = entries.item(0);

        expect(averageSpend).toBeTruthy();

        const averageSpendLabel = averageSpend.getElementsByClassName('widget-bar-entry-label').item(0);
        const averageSpendValue = averageSpend.getElementsByClassName('widget-bar-entry-value').item(0);
        const averageSpendField = averageSpendValue.getElementsByTagName('scrm-field').item(0);
        const averageSpendCurrency = averageSpendField.getElementsByTagName('scrm-currency-detail').item(0);

        expect(averageSpendLabel).toBeTruthy();
        expect(averageSpendLabel.textContent).toContain('AVERAGE CLOSED WON PER YEAR:');
        expect(averageSpendValue).toBeTruthy();
        expect(averageSpendField).toBeTruthy();
        expect(averageSpendCurrency).toBeTruthy();
        expect(averageSpendCurrency.textContent).toContain('$1,467');

        const oppTotal = entries.item(1);

        expect(oppTotal).toBeTruthy();

        const oppTotalLabel = oppTotal.getElementsByClassName('widget-bar-entry-label').item(0);
        const oppTotalValue = oppTotal.getElementsByClassName('widget-bar-entry-value').item(0);
        const oppTotalField = oppTotalValue.getElementsByTagName('scrm-field').item(0);
        const oppTotalCurrency = oppTotalField.getElementsByTagName('scrm-currency-detail').item(0);

        expect(oppTotalLabel).toBeTruthy();
        expect(oppTotalLabel.textContent).toContain('TOTAL OPPORTUNITY VALUE:');
        expect(oppTotalValue).toBeTruthy();
        expect(oppTotalField).toBeTruthy();
        expect(oppTotalCurrency).toBeTruthy();
        expect(oppTotalCurrency.textContent).toContain('$5,400');
    });
});
