import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TopWidgetComponent} from './top-widget.component';
import {DynamicModule} from 'ng-dynamic-component';
import {topWidgetModules} from '@containers/top-widget/components/top-widget/top-widget.manifest';

@NgModule({
    declarations: [TopWidgetComponent],
    exports: [TopWidgetComponent],
    imports: [
        CommonModule,
        ...topWidgetModules,
        DynamicModule,
    ]
})
export class TopWidgetModule {
}
