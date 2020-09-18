import {Input, OnDestroy, OnInit} from '@angular/core';
import {FieldGridRow} from '@components/field-grid/field-grid.model';
import {Subscription} from 'rxjs';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';


export abstract class BaseFieldGridComponent implements OnInit, OnDestroy {
    @Input() special = false;
    @Input() actions = false;

    @Input() labelClass: { [klass: string]: any } = {};
    @Input() inputClass: { [klass: string]: any } = {};
    @Input() rowClass: { [klass: string]: any } = {};
    @Input() colClass: { [klass: string]: any } = {};
    fieldGrid: FieldGridRow[];

    baseColClass = {
        col: true,
        'form-group': true,
        'm-1': true
    };

    baseRowClass = {
        'form-row': true,
    };

    baseLabelClass = {
        'col-form-label-sm': true,
        'mb-0': true,
    };

    baseInputClass = {
        'form-control': true,
        'form-control-sm': true,
    };

    protected currentSize = 'web';
    protected sizeMap = {
        handset: 1,
        tablet: 2,
        web: 3,
        wide: 4
    };

    protected subscriptions: Subscription[] = [];

    protected constructor(protected breakpointObserver: BreakpointObserver) {
    }

    ngOnInit(): void {
        this.initScreenSizeObserver(this.breakpointObserver);

        this.buildGrid();

        this.colClass = {
            ...this.colClass,
            ...this.baseColClass
        };

        this.rowClass = {
            ...this.rowClass,
            ...this.baseRowClass
        };

        this.labelClass = {
            ...this.labelClass,
            ...this.baseLabelClass
        };

        this.inputClass = {
            ...this.inputClass,
            ...this.baseInputClass
        };
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    get colNumber(): number {
        return this.sizeMap[this.currentSize];
    }

    protected addSpecialSlots(grid: FieldGridRow[]): void {
        if (!grid || grid.length === 0) {
            return;
        }
        const neededSlots = this.getNeededExtraSlots();

        if (neededSlots.length === 0) {
            return;
        }

        if (this.colNumber === 1) {

            neededSlots.reverse().forEach(type => {
                const newRow = {
                    cols: []
                } as FieldGridRow;
                this.fillRow(newRow);
                grid.push(newRow);

                newRow.cols[0][type] = true;
            });

        } else {
            const lastNeededCol = this.colNumber - neededSlots.length;
            let lastRow = grid[grid.length - 1];

            if (lastRow.cols[lastNeededCol].field) {
                lastRow = {
                    cols: []
                } as FieldGridRow;
                this.fillRow(lastRow);
                grid.push(lastRow);
            }

            let place = this.colNumber - 1;
            neededSlots.forEach(type => {
                lastRow.cols[place][type] = true;
                place--;
            });
        }

    }

    protected getNeededExtraSlots(): string[] {
        const neededSlots = [];

        if (this.actions) {
            neededSlots.push('actionSlot');
        }

        if (this.special) {
            neededSlots.push('specialSlot');
        }
        return neededSlots;
    }

    protected fillRow(row: FieldGridRow): void {
        const len = row.cols.length;
        for (let i = len; i < this.colNumber; i++) {
            row.cols.push({});
        }
    }

    protected initScreenSizeObserver(breakpointObserver: BreakpointObserver): void {
        this.subscriptions.push(breakpointObserver.observe([
            Breakpoints.HandsetPortrait,
        ]).subscribe((result: BreakpointState) => {
            if (result.matches) {
                this.currentSize = 'handset';
                this.buildGrid();
            }
        }));

        this.subscriptions.push(breakpointObserver.observe([
            Breakpoints.TabletPortrait,
            Breakpoints.HandsetLandscape,
        ]).subscribe((result: BreakpointState) => {
            if (result.matches) {
                this.currentSize = 'tablet';
                this.buildGrid();
            }
        }));

        this.subscriptions.push(breakpointObserver.observe([
            Breakpoints.TabletLandscape,
            Breakpoints.WebPortrait,
            Breakpoints.WebLandscape,
        ]).subscribe((result: BreakpointState) => {
            if (result.matches) {
                this.currentSize = 'web';
                this.buildGrid();
            }
        }));

        this.subscriptions.push(breakpointObserver.observe([
            Breakpoints.XLarge,
        ]).subscribe((result: BreakpointState) => {
            if (result.matches) {
                this.currentSize = 'wide';
                this.buildGrid();
            }
        }));
    }

    abstract buildGrid(): void;

}
