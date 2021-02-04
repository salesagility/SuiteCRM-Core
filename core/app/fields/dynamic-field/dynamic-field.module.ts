import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DynamicFieldComponent} from '@fields/dynamic-field/dynamic-field.component';
import {RouterModule} from '@angular/router';
import {DynamicLabelModule} from '@components/dynamic-label/dynamic-label.module';
import {DynamicModule} from 'ng-dynamic-component';

@NgModule({
    declarations: [DynamicFieldComponent],
    exports: [
        DynamicFieldComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        DynamicLabelModule,
        DynamicModule,
    ]
})
export class DynamicFieldModule {
}
