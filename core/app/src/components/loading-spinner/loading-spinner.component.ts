import {Component, Input} from '@angular/core';

@Component({
    selector: 'scrm-loading-spinner',
    templateUrl: './loading-spinner.component.html',
    styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
    @Input() overlay = false;

    constructor() {
    }
}
