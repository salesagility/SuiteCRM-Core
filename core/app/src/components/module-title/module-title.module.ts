import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModuleTitleComponent} from './module-title.component';

@NgModule({
    declarations: [ModuleTitleComponent],
    exports: [ModuleTitleComponent],
    imports: [
        CommonModule,
    ]
})
export class ModuleTitleModule {
}
