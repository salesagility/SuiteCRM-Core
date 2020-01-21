import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AppManagerModule} from '../../app-manager/app-manager.module';
import {ClassicViewUiComponent} from './classic-view.component';
import {ClassicViewUiRoutes} from './classic-view.routes';

@NgModule({
    declarations: [
        ClassicViewUiComponent,
    ],
    exports: [
        ClassicViewUiComponent
    ],
    imports: [
        AppManagerModule.forChild(ClassicViewUiComponent),
        RouterModule.forChild(ClassicViewUiRoutes),
        CommonModule
    ]
})
export class ClassicViewUiModule {
}
