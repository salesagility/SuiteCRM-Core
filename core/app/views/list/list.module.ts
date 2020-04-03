import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListComponent} from './list.component';
import {ListheaderUiModule} from '@components/list-header/list-header.module';
import {ListcontainerUiModule} from '@components/list-container/list-container.module';


@NgModule({
    declarations: [ListComponent],
    exports: [ListComponent],
    imports: [
        CommonModule,
        ListheaderUiModule,
        ListcontainerUiModule
    ]
})
export class ListModule {
}
