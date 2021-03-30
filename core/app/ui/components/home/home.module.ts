import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AppManagerModule} from '../../../../app-manager/app-manager.module';
import {HomeUiComponent} from './home.component';
import {HomeUiRoutes} from './home.routes';
import {NavbarUiModule} from '../navbar/navbar.module';
import {FooterUiModule} from '../footer/footer.module';

@NgModule({
    declarations: [
        HomeUiComponent
    ],
    exports: [
        HomeUiComponent
    ],
    imports: [
        AppManagerModule.forChild(HomeUiComponent),
        RouterModule.forChild(HomeUiRoutes),
        NavbarUiModule,
        FooterUiModule,
        CommonModule
    ]
})
export class HomeUiModule {
}