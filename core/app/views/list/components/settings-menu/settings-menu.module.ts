import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {SettingsMenuComponent} from './settings-menu.component';

import {ColumnChooserModule} from '@components/columnchooser/columnchooser.module';
import {ImageModule} from '@components/image/image.module';
import {ButtonModule} from '@components/button/button.module';
import {DropdownButtonModule} from '@components/dropdown-button/dropdown-button.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ButtonGroupModule} from '@components/button-group/button-group.module';

@NgModule({
    declarations: [SettingsMenuComponent],
    exports: [SettingsMenuComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(SettingsMenuComponent),
        ColumnChooserModule,
        ImageModule,
        ButtonModule,
        DropdownButtonModule,
        NgbModule,
        ButtonGroupModule
    ]
})
export class SettingsMenuModule {
}
