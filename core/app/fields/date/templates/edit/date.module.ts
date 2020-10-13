import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {DateEditFieldComponent} from '@fields/date/templates/edit/date.component';
import {FormsModule} from '@angular/forms';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {ButtonModule} from '@components/button/button.module';

@NgModule({
    declarations: [DateEditFieldComponent],
    exports: [DateEditFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(DateEditFieldComponent),
        FormsModule,
        NgbDatepickerModule,
        ButtonModule
    ]
})
export class DateEditFieldModule {
}
