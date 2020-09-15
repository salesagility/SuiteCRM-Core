import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppManagerModule} from '../../app-manager/app-manager.module';
import {SubpanelComponent} from './subpanel.component';
import {PanelModule} from '@components/panel/panel.module';
import {ImageModule} from '@components/image/image.module';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [SubpanelComponent],
    exports: [SubpanelComponent],
    imports: [
        CommonModule,
        NgbModule,
        ImageModule,
        AppManagerModule.forChild(SubpanelComponent),
        PanelModule,
        RouterModule
    ]
})
export class SubpanelModule {
}
