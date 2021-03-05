import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {DateFilterFieldComponent} from '@fields/date/templates/filter/date.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {ButtonModule} from '@components/button/button.module';

@NgModule({
    declarations: [DateFilterFieldComponent],
    exports: [DateFilterFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(DateFilterFieldComponent),
        FormsModule,
        NgbDatepickerModule,
        ButtonModule,
        ReactiveFormsModule
    ]
})
export class DateFilterFieldModule {
}
