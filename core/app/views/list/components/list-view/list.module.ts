import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListComponent} from './list.component';
import {ListHeaderModule} from '@views/list/components/list-header/list-header.module';
import {ListContainerModule} from '@views/list/components/list-container/list-container.module';
import {FieldModule} from '@fields/field.module';

@NgModule({
    declarations: [ListComponent],
    exports: [ListComponent],
    imports: [
        CommonModule,
        ListHeaderModule,
        ListContainerModule,
        FieldModule
    ],
})
export class ListModule {
}
