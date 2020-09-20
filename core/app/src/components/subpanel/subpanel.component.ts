import {
    Component,
    OnInit,
    Input
} from '@angular/core';

@Component({
    selector: 'scrm-subpanel',
    templateUrl: 'subpanel.component.html',
})
export class SubpanelComponent implements OnInit {
    @Input() title: string;

    constructor() {
    }

    ngOnInit(): void {
    }
}
