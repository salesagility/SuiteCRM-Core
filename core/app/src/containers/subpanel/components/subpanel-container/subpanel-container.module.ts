import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {SubpanelContainerComponent} from './subpanel-container.component';
import {SubpanelModule} from '../subpanel/subpanel.module';
import {ImageModule} from '@components/image/image.module';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {InlineLoadingSpinnerModule} from '@components/inline-loading-spinner/inline-loading-spinner.module';
import {FieldModule} from '@fields/field.module';

@NgModule({
    declarations: [SubpanelContainerComponent],
    exports: [SubpanelContainerComponent],
    imports: [
        CommonModule,
        NgbModule,
        ImageModule,
        AppManagerModule.forChild(SubpanelContainerComponent),
        RouterModule,
        SubpanelModule,
        InlineLoadingSpinnerModule,
        FieldModule
    ]
})
export class SubpanelContainerModule {
}
