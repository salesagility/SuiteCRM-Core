import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DynamicFieldComponent} from './dynamic-field.component';
import {FormControl, FormsModule} from '@angular/forms';
import {VarcharDetailFieldComponent} from '@fields/varchar/templates/detail/varchar.component';
import {CommonModule} from '@angular/common';
import {DynamicModule} from 'ng-dynamic-component';
import {RouterTestingModule} from '@angular/router/testing';
import {TagInputModule} from 'ngx-chips';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {NumberFormatter} from '@services/formatters/number/number-formatter.service';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';
import {datetimeFormatterMock} from '@services/formatters/datetime/datetime-formatter.service.spec.mock';
import {CurrencyFormatter} from '@services/formatters/currency/currency-formatter.service';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';
import {numberFormatterMock} from '@services/formatters/number/number-formatter.spec.mock';
import {currencyFormatterMock} from '@services/formatters/currency/currency-formatter.service.spec.mock';
import {systemConfigStoreMock} from '@store/system-config/system-config.store.spec.mock';
import {VarcharDetailFieldModule} from '@fields/varchar/templates/detail/varchar.module';

describe('DynamicFieldComponent', () => {
    let component: DynamicFieldComponent;
    let fixture: ComponentFixture<DynamicFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DynamicFieldComponent],
            imports: [
                [VarcharDetailFieldModule],
                CommonModule,
                DynamicModule.withComponents([VarcharDetailFieldComponent]),
                RouterTestingModule,
                TagInputModule,
                FormsModule,
                BrowserDynamicTestingModule,
                BrowserAnimationsModule
            ],
            providers: [
                {provide: LanguageStore, useValue: languageStoreMock},
                {provide: UserPreferenceStore, useValue: userPreferenceStoreMock},
                {provide: NumberFormatter, useValue: numberFormatterMock},
                {provide: DatetimeFormatter, useValue: datetimeFormatterMock},
                {provide: CurrencyFormatter, useValue: currencyFormatterMock},
                {provide: SystemConfigStore, useValue: systemConfigStoreMock}
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DynamicFieldComponent);
        component = fixture.componentInstance;
        component.mode = 'detail';
        component.type = 'varchar';
        component.field = {
            type: 'varchar',
            value: 'My Varchar',
            formControl: new FormControl('My Varchar')
        };
        component.klass = {'test-class': true};
        component.componentType = VarcharDetailFieldComponent;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render field component', () => {
        expect(component).toBeTruthy();

        const el = fixture.nativeElement;

        expect(el).toBeTruthy();
        expect(el.textContent).toContain('My Varchar');
    });
});
