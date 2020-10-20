import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {FormsModule} from '@angular/forms';
import {EnumEditFieldComponent} from '@fields/enum/templates/edit/enum.component';
import {TagInputModule} from 'ngx-chips';

@NgModule({
    declarations: [EnumEditFieldComponent],
    exports: [EnumEditFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(EnumEditFieldComponent),
        TagInputModule,
        FormsModule
    ]
})
export class EnumEditFieldModule {
}
