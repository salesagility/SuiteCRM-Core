import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {ImageComponent} from '@components/image/image.component';

@NgModule({
    declarations: [
        ImageComponent
    ],
    exports: [
        ImageComponent
    ],
    imports: [
        CommonModule,
        AngularSvgIconModule
    ]
})
export class ImageModule {
}
