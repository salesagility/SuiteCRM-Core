import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MinimiseButtonComponent} from './minimise-button.component';
import {ButtonModule} from '@components/button/button.module';

@NgModule({
    declarations: [MinimiseButtonComponent],
    exports: [
        MinimiseButtonComponent
    ],
    imports: [
        CommonModule,
        ButtonModule
    ]
})
export class MinimiseButtonModule {
}
