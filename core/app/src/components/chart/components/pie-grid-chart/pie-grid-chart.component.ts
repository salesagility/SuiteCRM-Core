import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseChartComponent} from '@components/chart/components/base-chart/base-chart.component';
import {SingleSeries} from '@app-common/containers/chart/chart.model';
import {Subscription} from 'rxjs';
import {LanguageStore} from '@store/language/language.store';

@Component({
    selector: 'scrm-pie-grid-chart',
    templateUrl: './pie-grid-chart.component.html',
    styleUrls: []
})
export class PieGridChartComponent extends BaseChartComponent implements OnInit, OnDestroy {
    results: SingleSeries;
    height = 700;
    view = [300, this.height];
    protected subs: Subscription[] = [];

    constructor() {
        super();
    }

    ngOnInit(): void {
        if (this.dataSource.options.height) {
            this.height = this.dataSource.options.height;
        }

        this.calculateView();

        this.subs.push(this.dataSource.getResults().subscribe(value => {
            this.results = value.singleSeries;
            this.calculateHeightBasedOnResults();
            this.calculateView();

        }));
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    get scheme(): string {
        return this.dataSource.options.scheme || 'picnic';
    }

    get label(): string {
        return this.dataSource.options.label || '';
    }

    onResize(): void {
        this.calculateHeightBasedOnResults();
        this.calculateView();
    }

    protected calculateHeightBasedOnResults(): void {
        if (this.results && this.results.length) {
            const perRow = Math.floor(this.view[0] / 170);
            this.height = (Math.floor(this.results.length / perRow) * 200);
        } else {
            this.height = 50;
        }
    }

}
