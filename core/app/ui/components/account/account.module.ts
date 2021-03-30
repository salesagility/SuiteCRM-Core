import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../../../app-manager/app-manager.module';
import {AccountUiComponent} from './account.component';
import {ListViewUiModule} from '../list-view/list-view.module';

@NgModule({
    declarations: [AccountUiComponent],
    exports: [AccountUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(AccountUiComponent),
        ListViewUiModule
    ]
})
export class AccountUiModule {
}