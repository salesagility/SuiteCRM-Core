import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ClassicViewUiComponent} from './app-files/ui/components/classic-view/classic-view.component';

import {AuthGuard} from './app-files/ui/services/auth/auth-guard.service';

const routes: Routes = [
  {
    path: 'Login',
    loadChildren: './app-files/ui/components/login/login.module#LoginUiModule'
  },
  {
    path: 'Logout',
    loadChildren: './app-files/ui/components/logout/logout.module#LogoutUiModule'
  },
  {
    path: 'Home',
    loadChildren: './app-files/ui/components/home/home.module#HomeUiModule',
    canActivate: [AuthGuard]
  },
  {
    path: ':module',
    component: ClassicViewUiComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':module/:action',
    component: ClassicViewUiComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':module/:action/:record',
    component: ClassicViewUiComponent,
    canActivate: [AuthGuard]
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
