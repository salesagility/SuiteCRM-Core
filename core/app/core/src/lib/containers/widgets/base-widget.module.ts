import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DynamicModule} from 'ng-dynamic-component';
import {BaseWidgetComponent} from './base-widget.model';

@NgModule({
    declarations: [BaseWidgetComponent],
    exports: [BaseWidgetComponent],
    imports: [
        CommonModule,
        DynamicModule,
    ]
})
export class BaseWidgetModule {
}
