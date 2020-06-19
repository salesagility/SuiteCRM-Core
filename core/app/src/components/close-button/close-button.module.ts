import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CloseButtonComponent} from './close-button.component';
import {ButtonModule} from '@components/button/button.module';

@NgModule({
    declarations: [CloseButtonComponent],
    exports: [
        CloseButtonComponent
    ],
    imports: [
        CommonModule,
        ButtonModule
    ]
})
export class CloseButtonModule {
}
