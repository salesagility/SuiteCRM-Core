import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {ClassicViewUiComponent} from './classic-view.component';

@NgModule({
    declarations: [
        ClassicViewUiComponent,
    ],
    exports: [
        ClassicViewUiComponent
    ],
    imports: [
        AppManagerModule.forChild(ClassicViewUiComponent),
        CommonModule
    ]
})
export class ClassicViewUiModule {
}
