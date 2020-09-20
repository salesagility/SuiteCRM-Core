import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppManagerModule} from '../../app-manager/app-manager.module';
import {SubpanelContainerComponent} from './subpanel-container.component';
import {SubpanelModule} from '../subpanel/subpanel.module';
import {PanelModule} from '@components/panel/panel.module';
import {ImageModule} from '@components/image/image.module';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [SubpanelContainerComponent],
    exports: [SubpanelContainerComponent],
    imports: [
        CommonModule,
        NgbModule,
        ImageModule,
        AppManagerModule.forChild(SubpanelContainerComponent),
        PanelModule,
        RouterModule,
        SubpanelModule
    ]
})
export class SubpanelContainerModule {
}
