import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RecordListModalComponent} from './record-list-modal.component';
import {ModalModule} from '@components/modal/components/modal/modal.module';
import {TableModule} from '@components/table/table.module';
import {LabelModule} from '@components/label/label.module';
import {LoadingSpinnerModule} from '@components/loading-spinner/loading-spinner.module';


@NgModule({
    declarations: [RecordListModalComponent],
    imports: [
        CommonModule,
        ModalModule,
        TableModule,
        LabelModule,
        LoadingSpinnerModule,
    ]
})
export class RecordListModalModule {
}
