import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

@Component({
    selector: 'scrm-user-action-menu-ui',
    templateUrl: './user-action-menu.component.html',
    styleUrls: []
})
export class UserActionMenuUiComponent implements OnInit {

    model = null;

    constructor(protected http: HttpClient) {
    }

    ngOnInit() {
    }

}
