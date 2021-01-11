import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalButtonGroupComponent} from './modal-button-group.component';
import {ButtonGroupModule} from '@components/button-group/button-group.module';

@NgModule({
    declarations: [ModalButtonGroupComponent],
    exports: [
        ModalButtonGroupComponent
    ],
    imports: [
        CommonModule,
        ButtonGroupModule
    ]
})
export class ModalButtonGroupModule {
}
