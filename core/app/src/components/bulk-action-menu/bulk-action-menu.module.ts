import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {BulkActionMenuComponent} from './bulk-action-menu.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [BulkActionMenuComponent],
    exports: [BulkActionMenuComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(BulkActionMenuComponent),
        NgbModule,
    ]
})
export class BulkActionMenuModule {
}
