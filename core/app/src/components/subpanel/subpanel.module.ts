import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppManagerModule} from '../../app-manager/app-manager.module';
import {SubpanelComponent} from './subpanel.component';
import {PanelModule} from '@components/panel/panel.module';

@NgModule({
    declarations: [SubpanelComponent],
    exports: [SubpanelComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(SubpanelComponent),
        PanelModule,
    ]
})
export class SubpanelModule {
}
