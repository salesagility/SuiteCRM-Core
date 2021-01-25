import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PanelComponent} from './panel.component';
import {ButtonModule} from '@components/button/button.module';
import {CloseButtonModule} from '@components/close-button/close-button.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MinimiseButtonModule} from '@components/minimise-button/minimise-button.module';
import {LabelModule} from '@components/label/label.module';

@NgModule({
    declarations: [PanelComponent],
    exports: [
        PanelComponent
    ],
    imports: [
        CommonModule,
        ButtonModule,
        CloseButtonModule,
        NgbModule,
        MinimiseButtonModule,
        LabelModule
    ]
})
export class PanelModule {
}
