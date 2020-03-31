import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {MessageService} from '../../services/message/message.service';
import {NavbarUiComponent} from '../navbar/navbar.component';
import {ApiService} from '../../services/api/api.service';

@Component({
    selector: 'scrm-logout-ui',
    templateUrl: './logout.component.html',
    styleUrls: []
})
export class LogoutUiComponent implements OnInit {

    constructor(
        public api: ApiService,
        public router: Router,
        public auth: AuthService,
        public message: MessageService
    ) {
    }

    ngOnInit() {

    }

    doLogout() {
        this.auth.doLogout(this, this.onLogoutSuccess, this.onLogoutError);
    }

    onLogoutSuccess(caller: LogoutUiComponent) {
        caller.message.log('Logout success');
        caller.message.addSuccessMessage('Logout success');
        caller.router.navigate(['/Login']);
        return;
    }

    onLogoutError(caller: LogoutUiComponent, errorResponse: HttpErrorResponse) {
        caller.message.log('Logout failed');
    }

}
