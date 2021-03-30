import {Route} from '@angular/router';
import {HomeUiComponent} from './home.component'
import {NavbarUiComponent} from '../navbar/navbar.component';
import {FooterUiComponent} from '../footer/footer.component';

export const HomeUiRoutes: Route[] = [
    {
        path: '',
        component: HomeUiComponent
    },
    {
        path: '',
        component: NavbarUiComponent
    },
    {
        path: '',
        component: FooterUiComponent
    }
];