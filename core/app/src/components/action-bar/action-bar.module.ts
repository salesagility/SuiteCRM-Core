import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '../../app-manager/app-manager.module';
import {ActionBarUiComponent} from './action-bar.component';
import {ImageModule} from '@components/image/image.module';
import {RouterModule} from '@angular/router';

@NgModule({
    declarations: [ActionBarUiComponent],
    exports: [ActionBarUiComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(ActionBarUiComponent),
        ImageModule,
        RouterModule
    ]
})
export class ActionBarUiModule {
}
