import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListFilterComponent} from './list-filter.component';
import {ButtonModule} from '@components/button/button.module';
import {PanelModule} from '@components/panel/panel.module';
import {FieldGridModule} from '@components/field-grid/field-grid.module';
import {DropdownButtonModule} from '@components/dropdown-button/dropdown-button.module';
import {LabelModule} from '@components/label/label.module';

@NgModule({
    declarations: [ListFilterComponent],
    exports: [
        ListFilterComponent
    ],
    imports: [
        CommonModule,
        ButtonModule,
        PanelModule,
        FieldGridModule,
        DropdownButtonModule,
        LabelModule
    ]
})
export class ListFilterModule {
}
