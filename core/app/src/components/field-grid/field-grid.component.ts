import {Component, Input, OnChanges} from '@angular/core';
import {FieldGridColumn, FieldGridRow} from '@components/field-grid/field-grid.model';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Field} from '@app-common/record/field.model';
import {BaseFieldGridComponent} from '@components/field-grid/base-field-grid.component';

@Component({
    selector: 'scrm-field-grid',
    templateUrl: './field-grid.component.html',
    styles: []
})
export class FieldGridComponent extends BaseFieldGridComponent implements OnChanges {

    @Input() fields: Field[];
    @Input() fieldMode = 'detail';

    constructor(protected breakpointObserver: BreakpointObserver) {
        super(breakpointObserver);
    }

    ngOnChanges(): void {
        this.buildGrid();
    }

    buildGrid(): void {
        const grid: FieldGridRow[] = [];

        if (!this.fields || this.fields.length === 0) {
            this.fieldGrid = [];
            return;
        }

        let col = 0;
        let row = {
            cols: []
        } as FieldGridRow;
        grid.push(row);

        this.fields.forEach(field => {

            if (col >= this.colNumber) {
                col = 0;
                row = {
                    cols: []
                } as FieldGridRow;
                grid.push(row);
            }

            row.cols.push({
                field
            } as FieldGridColumn);

            col++;
        });

        const lastRow = grid[grid.length - 1];
        if (col < this.colNumber) {
            this.fillRow(lastRow);
        }

        this.addSpecialSlots(grid);

        this.fieldGrid = grid;
    }
}
