import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {LineActionMenuComponent} from './line-action-menu.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ImageModule} from '@components/image/image.module';
import {RouterModule} from '@angular/router';

@NgModule({
    declarations: [LineActionMenuComponent],
    exports: [LineActionMenuComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(LineActionMenuComponent),
        NgbModule,
        ImageModule,
        RouterModule,
    ]
})

export class LineActionModule {
}
