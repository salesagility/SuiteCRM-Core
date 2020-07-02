import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SortButtonComponent} from './sort-button.component';
import {ImageModule} from '@components/image/image.module';

@NgModule({
    declarations: [SortButtonComponent],
    exports: [
        SortButtonComponent
    ],
    imports: [
        CommonModule,
        ImageModule
    ]
})
export class SortButtonModule {
}
