import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DropdownSubmenuComponent} from '@components/dropdown-submenu/dropdown-submenu.component';
import {ImageModule} from '@components/image/image.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [DropdownSubmenuComponent],
    exports: [
        DropdownSubmenuComponent
    ],
    imports: [
        CommonModule,
        ImageModule,
        NgbModule
    ]
})
export class DropdownSubmenuModule {
}
