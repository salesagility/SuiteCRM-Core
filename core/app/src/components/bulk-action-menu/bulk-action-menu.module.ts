import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {BulkActionMenuComponent} from './bulk-action-menu.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DropdownButtonModule} from '@components/dropdown-button/dropdown-button.module';

@NgModule({
    declarations: [BulkActionMenuComponent],
    exports: [BulkActionMenuComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(BulkActionMenuComponent),
        NgbModule,
        DropdownButtonModule,
    ]
})
export class BulkActionMenuModule {
}
