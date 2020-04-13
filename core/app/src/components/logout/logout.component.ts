import {Component} from '@angular/core';
import {AuthService} from '@services/auth/auth.service';

@Component({
    selector: 'scrm-logout-ui',
    templateUrl: './logout.component.html',
    styleUrls: []
})
export class LogoutUiComponent {

    constructor(protected auth: AuthService) {
    }

    /**
     * call logout
     */
    doLogout(): void {
        this.auth.logout();
    }
}
