import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {RelateDetailFieldComponent} from './relate.component';

@NgModule({
    declarations: [RelateDetailFieldComponent],
    exports: [RelateDetailFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(RelateDetailFieldComponent)
    ]
})
export class RelateDetailFieldsModule {
}
