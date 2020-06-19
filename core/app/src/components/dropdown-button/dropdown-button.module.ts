import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DropdownButtonComponent} from './dropdown-button.component';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [DropdownButtonComponent],
    exports: [
        DropdownButtonComponent
    ],
    imports: [
        CommonModule,
        NgbDropdownModule
    ]
})
export class DropdownButtonModule {
}
