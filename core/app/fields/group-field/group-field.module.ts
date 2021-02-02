import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GroupFieldComponent} from './group-field.component';
import {LabelModule} from '@components/label/label.module';
import {DynamicFieldModule} from '@fields/dynamic-field/dynamic-field.module';


@NgModule({
    declarations: [GroupFieldComponent],
    imports: [
        CommonModule,
        LabelModule,
        DynamicFieldModule
    ]
})
export class GroupFieldModule {
}
