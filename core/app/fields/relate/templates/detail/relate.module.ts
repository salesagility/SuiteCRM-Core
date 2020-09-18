import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {RelateDetailFieldsComponent} from './relate.component';

@NgModule({
    declarations: [RelateDetailFieldsComponent],
    exports: [RelateDetailFieldsComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(RelateDetailFieldsComponent)
    ]
})
export class RelateDetailFieldsModule {
}
