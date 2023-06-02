import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {UKPhoneEditFieldComponent} from './fields/uk-phone/templates/edit/uk-phone.component';
import {UkPhoneEditFieldModule} from './fields/uk-phone/templates/edit/uk-phone.module';
import {FieldRegistry} from 'core';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        HttpClientModule,
        UkPhoneEditFieldModule
    ],
    providers: []
})
export class ExtensionModule {
    constructor(
        protected fieldRegistry: FieldRegistry
    ) {
        // Override the edit mode phone field component for all modules
        fieldRegistry.register('default', 'phone', 'edit', UKPhoneEditFieldComponent);

        // Override the edit mode phone field component just for accounts
        // fieldRegistry.register('accounts', 'phone', 'edit', UKPhoneEditFieldComponent);
    }

    init(): void {
    }
}
