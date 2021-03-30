import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {ApiService} from '../../services/api/api.service';

@Component({
    selector: 'scrm-navbar-ui',
    templateUrl: './navbar.component.html',
    styleUrls: []
})
export class NavbarUiComponent implements OnInit {
    protected navbar: any = {};

    protected loaded = true;

    constructor(protected api: ApiService, protected router: Router) {
    }

    ngOnInit(): void {
        this.navbar.authenticated = false;
    }
}
