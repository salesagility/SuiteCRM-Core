import {Component, Input, OnInit} from '@angular/core';
import {DropdownButtonInterface} from '@app-common/components/button/dropdown-button.model';
import {ButtonInterface} from '@app-common/components/button/button.model';
import {NgbDropdown} from '@ng-bootstrap/ng-bootstrap';
import {PlacementArray} from '@ng-bootstrap/ng-bootstrap/util/positioning';

@Component({
    selector: 'scrm-dropdown-button',
    templateUrl: './dropdown-button.component.html',
    styles: [],
})
export class DropdownButtonComponent implements OnInit {
    @Input() config: DropdownButtonInterface;
    @Input() disabled = false;
    @Input() autoClose: boolean | 'outside' | 'inside' = true;

    constructor() {
    }

    isDropdown(item: ButtonInterface): boolean {
        if (!item) {
            return false;
        }
        return 'items' in item;
    }

    click(onClick: Function, dropdown: NgbDropdown): void {
        onClick();
        dropdown.close();
    }

    close(dropdown: NgbDropdown): void {
        dropdown.close();
    }

    ngOnInit(): void {
        if (this.config && !this.config.placement) {
            this.config.placement = ['bottom-left', 'bottom-right', 'top-left', 'top-right'];
        }
    }

    getPlacement(): PlacementArray {
        if (this.config && !this.config.placement) {
            return ['bottom-left', 'bottom-right', 'top-left', 'top-right'];
        }
        return this.config.placement;
    }

}
