import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ClassicViewUiComponent} from '@components/classic-view/classic-view.component';
import {ClassicViewResolver} from '@services/classic-view/classic-view.resolver';
import {BaseMetadataResolver} from '@services/metadata/base-metadata.resolver';
import {AuthGuard} from '@services/auth/auth-guard.service';
import {ListComponent} from '@views/list/list.component';
import {LoginAuthGuard} from '@services/auth/login-auth-guard.service';
import {BaseModuleResolver} from '@services/metadata/base-module.resolver';

const routes: Routes = [
    {
        path: ':module/list-new',
        component: ListComponent,
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always',
        resolve: {
            view: BaseModuleResolver
        },
        data: {
            reuseRoute: false,
        }
    },
    {
        path: 'Login',
        loadChildren: () => import('../components/login/login.module').then(m => m.LoginUiModule),
        canActivate: [LoginAuthGuard],
        runGuardsAndResolvers: 'always',
        resolve: {
            metadata: BaseMetadataResolver
        },
        data: {
            reuseRoute: false,
            load: {
                navigation: false,
                preferences: false,
                languageStrings: ['appStrings']
            }
        }
    },
    {
        path: ':module',
        component: ClassicViewUiComponent,
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always',
        resolve: {
            legacyUrl: ClassicViewResolver,
        },
        data: {
            reuseRoute: false,
            checkSession: true
        }
    },
    {
        path: ':module/:action',
        component: ClassicViewUiComponent,
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always',
        resolve: {
            legacyUrl: ClassicViewResolver,
        },
        data: {
            reuseRoute: false,
            checkSession: true
        }
    },
    {
        path: ':module/:action/:record',
        component: ClassicViewUiComponent,
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always',
        resolve: {
            legacyUrl: ClassicViewResolver,
        },
        data: {
            reuseRoute: false,
            checkSession: true
        }
    },
    {path: '**', redirectTo: 'Login'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        useHash: true,
        onSameUrlNavigation: 'reload'
    })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
