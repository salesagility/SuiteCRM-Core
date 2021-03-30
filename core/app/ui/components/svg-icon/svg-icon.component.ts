import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'scrm-svg-icon-ui',
    templateUrl: './svg-icon.component.html',
    styleUrls: []
})
export class SvgIconUiComponent implements OnInit {
    @Input() file: string = "";

    constructor() {
    }

    ngOnInit() {

    }
}
