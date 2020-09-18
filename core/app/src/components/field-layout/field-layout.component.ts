import {Component, Input} from '@angular/core';
import {FieldMap} from '@app-common/record/field.model';
import {FieldGridColumn, FieldGridRow} from '@components/field-grid/field-grid.model';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Panel} from '@app-common/metadata/metadata.model';
import {FieldLayoutConfig, FieldLayoutDataSource} from '@components/field-layout/field-layout.model';
import {BaseFieldGridComponent} from '@components/field-grid/base-field-grid.component';
import {Record} from '@app-common/record/record.model';

@Component({
    selector: 'scrm-field-layout',
    templateUrl: './field-layout.component.html',
    styles: []
})
export class FieldLayoutComponent extends BaseFieldGridComponent {

    @Input() dataSource: FieldLayoutDataSource;
    config: FieldLayoutConfig;
    layout: Panel;
    fields: FieldMap;
    record: Record;

    baseColClass = {
        col: true,
        'form-group': true,
        'm-1': false,
        'm-0': true,
        'pl-3': true,
        'pb-2': true,
        'pr-3': true
    };

    constructor(protected breakpointObserver: BreakpointObserver) {
        super(breakpointObserver);
    }

    ngOnInit(): void {

        this.subscriptions.push(this.dataSource.getConfig().subscribe(config => {
            this.config = {...config};
        }));
        this.subscriptions.push(this.dataSource.getLayout().subscribe(layout => {
            this.layout = {...layout};
        }));
        this.subscriptions.push(this.dataSource.getFields().subscribe(fields => {
            this.fields = {...fields};
        }));
        this.subscriptions.push(this.dataSource.getRecord().subscribe(record => {
            this.record = {...record};
        }));

        super.ngOnInit();
    }

    buildGrid(): void {
        const grid: FieldGridRow[] = [];

        if (!this.fields || Object.keys(this.fields).length === 0) {
            this.fieldGrid = [];
            return;
        }

        this.layout.rows.forEach(layoutRow => {
            let row = {
                cols: []
            } as FieldGridRow;

            layoutRow.cols.forEach((layoutCol, colIndex) => {
                const fieldName = layoutCol.name;
                const field = this.fields[fieldName] || null;

                if (!field) {
                    row.cols.push({} as FieldGridColumn);
                    return;
                }

                row.cols.push({
                    field
                } as FieldGridColumn);

                if (this.colNumber === 1 && colIndex < layoutRow.cols.length - 1) {
                    grid.push(row);

                    row = {
                        cols: []
                    } as FieldGridRow;
                }
            });

            if (row.cols.length < this.colNumber) {
                this.fillRow(row);
            }


            grid.push(row);
        });

        this.addSpecialSlots(grid);

        this.fieldGrid = grid;
    }

    get colNumber(): number {
        const size = this.sizeMap[this.currentSize];
        if (size === 1) {
            return 1;
        }
        return this.config.maxColumns;
    }

}
