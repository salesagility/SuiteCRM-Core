import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {DynamicFieldComponent} from './dynamic-field.component';
import {FormControl, FormsModule} from '@angular/forms';
import {VarcharDetailFieldComponent} from '@fields/varchar/templates/detail/varchar.component';
import {CommonModule} from '@angular/common';
import {RouterTestingModule} from '@angular/router/testing';
import {TagInputModule} from 'ngx-chips';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
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
import {interval} from 'rxjs';
import {take} from 'rxjs/operators';
import {fieldModules} from '@fields/field.manifest';
import {DynamicModule} from 'ng-dynamic-component';

describe('DynamicFieldComponent', () => {
    let component: DynamicFieldComponent;
    let fixture: ComponentFixture<DynamicFieldComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [DynamicFieldComponent],
            imports: [
                ...fieldModules,
                CommonModule,
                RouterTestingModule,
                TagInputModule,
                FormsModule,
                DynamicModule,
                BrowserDynamicTestingModule,
                NoopAnimationsModule
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
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render field component', async (done) => {

        fixture.detectChanges();
        await fixture.whenRenderingDone();

        await interval(300).pipe(take(1)).toPromise();

        const el = fixture.nativeElement;

        expect(el).toBeTruthy();
        expect(el.textContent).toContain('My Varchar');

        done();
    });
});
