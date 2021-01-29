import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DynamicFieldComponent} from '@fields/dynamic-field/dynamic-field.component';
import {RouterModule} from '@angular/router';
import {DynamicComponentModule} from 'ng-dynamic-component';
import {DynamicLabelModule} from '@components/dynamic-label/dynamic-label.module';

@NgModule({
    declarations: [DynamicFieldComponent],
    exports: [
        DynamicFieldComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        DynamicLabelModule,
        DynamicComponentModule,
    ]
})
export class DynamicFieldModule {
}
