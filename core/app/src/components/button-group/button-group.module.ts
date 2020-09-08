import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonGroupComponent} from '@components/button-group/button-group.component';
import {ButtonModule} from '@components/button/button.module';
import {DropdownButtonModule} from '@components/dropdown-button/dropdown-button.module';


@NgModule({
    declarations: [ButtonGroupComponent],
    exports: [
        ButtonGroupComponent
    ],
    imports: [
        CommonModule,
        ButtonModule,
        DropdownButtonModule,
    ]
})
export class ButtonGroupModule {
}
