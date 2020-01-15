import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {AccountUiComponent} from './account.component';
import {ListViewUiModule} from '../list-view/list-view.module';
import {RouterModule} from '@angular/router';
import {AccountUiRoutes} from './account.routes';

@NgModule({
    declarations: [AccountUiComponent],
    exports: [AccountUiComponent],
    imports: [
        CommonModule,
        ListViewUiModule,
        AppManagerModule.forChild(AccountUiComponent),
        RouterModule.forChild(AccountUiRoutes),
    ]
})
export class AccountUiModule {
}
