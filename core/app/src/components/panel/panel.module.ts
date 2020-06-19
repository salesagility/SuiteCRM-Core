import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PanelComponent} from './panel.component';
import {ButtonModule} from '@components/button/button.module';
import {CloseButtonModule} from '@components/close-button/close-button.module';

@NgModule({
    declarations: [PanelComponent],
    exports: [
        PanelComponent
    ],
    imports: [
        CommonModule,
        ButtonModule,
        CloseButtonModule
    ]
})
export class PanelModule {
}
