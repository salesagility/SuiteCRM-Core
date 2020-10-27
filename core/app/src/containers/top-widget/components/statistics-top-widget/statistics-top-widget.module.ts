import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FieldModule} from '@fields/field.module';
import {StatisticsTopWidgetComponent} from '@base/containers/top-widget/components/statistics-top-widget/statistics-top-widget.component';
import {InlineLoadingSpinnerModule} from '@components/inline-loading-spinner/inline-loading-spinner.module';

@NgModule({
    declarations: [StatisticsTopWidgetComponent],
    exports: [
        StatisticsTopWidgetComponent
    ],
    imports: [
        CommonModule,
        FieldModule,
        InlineLoadingSpinnerModule
    ]
})
export class StatisticsTopWidgetModule {
}
