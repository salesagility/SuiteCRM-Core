/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {SingleSeries} from '../../../../common/containers/chart/chart.model';
import {isFalse} from '../../../../common/utils/value-utils';
import {BaseChartComponent} from '../base-chart/base-chart.component';
import {ScreenSizeObserverService} from "../../../../services/ui/screen-size-observer/screen-size-observer.service";
import {debounceTime} from "rxjs/operators";

@Component({
    selector: 'scrm-vertical-bar-chart',
    templateUrl: './vertical-bar-chart.component.html',
    styleUrls: []
})
export class VerticalBarChartComponent extends BaseChartComponent implements OnInit, OnDestroy {

    results: SingleSeries;

    constructor(protected elementRef: ElementRef, protected screenSize: ScreenSizeObserverService) {
        super(elementRef, screenSize);
    }

    ngOnInit(): void {
        if (this.dataSource.options.height) {
            this.height = this.dataSource.options.height;
        }

        this.initResizeListener();

        this.subs.push(this.dataSource.getResults().pipe(debounceTime(500)).subscribe(value => {
            this.results = value.singleSeries;
            this.calculateView()
        }));
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    get scheme(): string {
        return this.dataSource.options.scheme || 'picnic';
    }

    get gradient(): boolean {
        return this.dataSource.options.gradient || false;
    }

    get xAxis(): boolean {
        return this.dataSource.options.xAxis || false;
    }

    get yAxis(): boolean {
        return !isFalse(this.dataSource.options.yAxis);
    }

    get legend(): boolean {
        return !isFalse(this.dataSource.options.legend);
    }

    get showXAxisLabel(): boolean {
        return this.dataSource.options.showXAxisLabel || false;
    }

    get showYAxisLabel(): boolean {
        return this.dataSource.options.showYAxisLabel || false;
    }

    get xAxisLabel(): string {
        return this.dataSource.options.xAxisLabel || '';
    }

    get yAxisLabel(): string {
        return this.dataSource.options.yAxisLabel || '';
    }

    get yAxisTickFormatting(): Function {
        if (this.dataSource.options.yAxisTickFormatting) {
            return this.dataSource.tickFormatting;
        }
        return null;
    }

    formatTooltipValue(value: any): any {
        if (!this.dataSource || !this.dataSource.tooltipFormatting) {
            return value;
        }
        return this.dataSource.tooltipFormatting(value);
    }
}
