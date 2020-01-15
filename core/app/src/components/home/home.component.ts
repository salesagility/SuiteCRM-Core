import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {AuthService} from '../../services/auth/auth.service';
import {LoginResponseModel} from '../../services/auth/login-response-model';
import {MessageService} from '../../services/message/message.service';
import {ApiService} from '../../services/api/api.service';

@Component({
    selector: 'scrm-home-ui',
    templateUrl: './home.component.html',
    styleUrls: []
})
export class HomeUiComponent {

}
