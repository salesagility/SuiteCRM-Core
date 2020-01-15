import {Component, OnInit} from '@angular/core';
import {ActionBarModel} from './action-bar-model';

@Component({
    selector: 'scrm-action-bar-ui',
    templateUrl: './action-bar.component.html',
    styleUrls: []
})
export class ActionBarUiComponent implements OnInit {

    actionBar: ActionBarModel = {
        createLinks: [],
        favoriteRecords: [],
    };

    constructor() {
    }

    ngOnInit(): void {

    }

}
