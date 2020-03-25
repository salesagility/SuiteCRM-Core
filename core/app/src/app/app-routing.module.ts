import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ClassicViewUiComponent} from '@components/classic-view/classic-view.component';
import {ClassicViewResolver} from '@services/classic-view/classic-view.resolver';
import {BaseMetadataResolver} from '@services/metadata/base-metadata.resolver';
import {AuthGuard} from '../services/auth/auth-guard.service';
import {ListComponent} from '@views/list/list.component';

const routes: Routes = [
    {
        path: 'Listview',
        component: ListComponent,
        resolve: {view: BaseMetadataResolver}
    },
    {
        path: 'Login',
        loadChildren: () => import('../components/login/login.module').then(m => m.LoginUiModule),
        resolve: {view: BaseMetadataResolver}
    },
    {
        path: 'Home',
        loadChildren: () => import('../components/home/home.module').then(m => m.HomeUiModule),
    },
    {
        path: ':module',
        component: ClassicViewUiComponent,
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always',
        resolve: {view: ClassicViewResolver},
        data: {
            reuseRoute: false
        }
    },
    {
        path: ':module/:action',
        component: ClassicViewUiComponent,
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always',
        resolve: {view: ClassicViewResolver},
        data: {
            reuseRoute: false
        }
    },
    {
        path: ':module/:action/:record',
        component: ClassicViewUiComponent,
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always',
        resolve: {view: ClassicViewResolver},
        data: {
            reuseRoute: false
        }
    },
    {path: '**', redirectTo: 'Login'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        useHash: true
    })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
