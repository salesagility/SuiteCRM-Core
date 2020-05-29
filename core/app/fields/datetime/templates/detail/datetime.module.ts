import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {DateTimeDetailFieldComponent} from '@fields/datetime/templates/detail/datetime.component';

@NgModule({
    declarations: [DateTimeDetailFieldComponent],
    exports: [DateTimeDetailFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(DateTimeDetailFieldComponent)
    ]
})
export class DateTimeDetailFieldModule {
}
