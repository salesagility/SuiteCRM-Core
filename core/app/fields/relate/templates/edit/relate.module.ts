import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppManagerModule} from '@base/app-manager/app-manager.module';
import {RelateEditFieldComponent} from './relate.component';
import {TagInputModule} from 'ngx-chips';
import {LabelModule} from '@components/label/label.module';
import {FormsModule} from '@angular/forms';
import {InlineLoadingSpinnerModule} from '@components/inline-loading-spinner/inline-loading-spinner.module';

@NgModule({
    declarations: [RelateEditFieldComponent],
    exports: [RelateEditFieldComponent],
    imports: [
        CommonModule,
        AppManagerModule.forChild(RelateEditFieldComponent),
        TagInputModule,
        LabelModule,
        FormsModule,
        InlineLoadingSpinnerModule
    ]
})
export class RelateEditFieldModule {
}
