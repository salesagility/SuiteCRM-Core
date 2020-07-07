import {Component, Input} from '@angular/core';
import {DropdownButtonInterface} from '@components/dropdown-button/dropdown-button.model';

@Component({
    selector: 'scrm-dropdown-button',
    templateUrl: './dropdown-button.component.html',
    styles: []
})
export class DropdownButtonComponent {
    @Input() config: DropdownButtonInterface;
    @Input() disabled = false;

    constructor() {
    }
}
