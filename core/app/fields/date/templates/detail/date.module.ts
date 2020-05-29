import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {DateDetailFieldComponent} from '@fields/date/templates/detail/date.component';

@NgModule({
    declarations: [DateDetailFieldComponent],
    exports: [DateDetailFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(DateDetailFieldComponent)
    ]
})
export class DateDetailFieldModule {
}
