import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ClassicViewUiComponent} from '../components/classic-view/classic-view.component';

import {AuthGuard} from '../services/auth/auth-guard.service';

const routes: Routes = [
  {
    path: 'Accounts/index',
    loadChildren: '../components/account/account.module#AccountUiModule'
  },
  {
    path: 'Login',
    loadChildren: '../components/login/login.module#LoginUiModule'
  },
  {
    path: 'Home',
    loadChildren: '../components/home/home.module#HomeUiModule',
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
