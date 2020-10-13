import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {DateTimeEditFieldComponent} from './datetime.component';
import {FormsModule} from '@angular/forms';
import {NgbDatepickerModule, NgbTimepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {ImageModule} from '@components/image/image.module';
import {ButtonModule} from '@components/button/button.module';

@NgModule({
    declarations: [DateTimeEditFieldComponent],
    exports: [DateTimeEditFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(DateTimeEditFieldComponent),
        FormsModule,
        NgbDatepickerModule,
        NgbTimepickerModule,
        ImageModule,
        ButtonModule
    ]
})
export class DateTimeEditFieldModule {
}
