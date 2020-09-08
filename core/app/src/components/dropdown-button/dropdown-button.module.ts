import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DropdownButtonComponent} from './dropdown-button.component';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {ImageModule} from '@components/image/image.module';
import {DropdownSubmenuModule} from '@components/dropdown-submenu/dropdown-submenu.module';

@NgModule({
    declarations: [DropdownButtonComponent],
    exports: [
        DropdownButtonComponent
    ],
    imports: [
        CommonModule,
        NgbDropdownModule,
        ImageModule,
        DropdownSubmenuModule
    ]
})
export class DropdownButtonModule {
}
