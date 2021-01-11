import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MessageModalComponent} from './message-modal.component';
import {ModalModule} from '@components/modal/components/modal/modal.module';
import {ButtonGroupModule} from '@components/button-group/button-group.module';
import {LabelModule} from '@components/label/label.module';
import {ModalButtonGroupModule} from '@components/modal/components/modal-button-group/modal-button-group.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [MessageModalComponent],
    exports: [MessageModalComponent],
    imports: [
        CommonModule,
        ModalModule,
        ButtonGroupModule,
        LabelModule,
        ModalButtonGroupModule,
        NgbModule
    ]
})
export class MessageModalModule {
}
