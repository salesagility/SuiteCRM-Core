import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {FullPageSpinnerComponent} from '@components/full-page-spinner/full-page-spinner.component';

@NgModule({
    declarations: [
        FullPageSpinnerComponent
    ],
    exports: [
        FullPageSpinnerComponent
    ],
    imports: [
        CommonModule,
        AngularSvgIconModule
    ]
})
export class FullPageSpinnerModule {
}
