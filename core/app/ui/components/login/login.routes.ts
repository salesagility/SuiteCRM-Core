import {Route} from '@angular/router';
import {LoginUiComponent} from './login.component'
import {HomeUiComponent} from '../home/home.component';

export const LoginUiRoutes: Route[] = [
    {
        path: '',
        component: LoginUiComponent
    }
];