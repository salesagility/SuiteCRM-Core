import {Component, Input} from '@angular/core';
import {SortDirection, SortDirectionDataSource} from '@components/sort-button/sort-button.model';
import {Observable} from 'rxjs';

@Component({
    selector: 'scrm-sort-button',
    templateUrl: './sort-button.component.html',
    styles: []
})
export class SortButtonComponent {
    @Input() state: SortDirectionDataSource;
    direction$: Observable<SortDirection>;

    protected statusIcons = {
        NONE: 'sort',
        ASC: 'sort_ascend',
        DESC: 'sort_descend'
    };

    protected nextDirection = {
        NONE: SortDirection.DESC,
        ASC: SortDirection.NONE,
        DESC: SortDirection.ASC
    };

    constructor() {
    }

    ngOnInit(): void {
        this.direction$ = this.state.getSortDirection();
    }

    getStatusIcon(direction: SortDirection): string {
        return this.statusIcons[direction];
    }

    changeSorting(direction: SortDirection): void {
        const newDirection = this.nextDirection[direction];
        this.state.changeSortDirection(newDirection);
    }
}
