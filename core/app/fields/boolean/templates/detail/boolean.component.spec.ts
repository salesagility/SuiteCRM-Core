import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {BooleanDetailFieldComponent} from './boolean.component';
import {Field} from '@app-common/record/field.model';
import {HtmlSanitizeModule} from '@base/pipes/html-sanitize/html-sanitize.module';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';
import {NumberFormatter} from '@services/formatters/number/number-formatter.service';
import {numberFormatterMock} from '@services/formatters/number/number-formatter.spec.mock';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';
import {datetimeFormatterMock} from '@services/formatters/datetime/datetime-formatter.service.spec.mock';
import {DateFormatter} from '@services/formatters/datetime/date-formatter.service';
import {dateFormatterMock} from '@services/formatters/datetime/date-formatter.service.spec.mock';
import {CurrencyFormatter} from '@services/formatters/currency/currency-formatter.service';

@Component({
    selector: 'boolean-detail-field-test-host-component',
    template: '<scrm-boolean-detail [field]="field"></scrm-boolean-detail>'
})
class BooleanDetailFieldTestHostComponent {
    field: Field = {
        type: 'boolean',
        value: 'true'
    };
}

describe('BooleanDetailFieldComponent', () => {
    let testHostComponent: BooleanDetailFieldTestHostComponent;
    let testHostFixture: ComponentFixture<BooleanDetailFieldTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BooleanDetailFieldTestHostComponent,
                BooleanDetailFieldComponent,
            ],
            imports: [
                HtmlSanitizeModule
            ],
            providers: [
                {provide: UserPreferenceStore, useValue: userPreferenceStoreMock},
                {provide: NumberFormatter, useValue: numberFormatterMock},
                {provide: DatetimeFormatter, useValue: datetimeFormatterMock},
                {provide: DateFormatter, useValue: dateFormatterMock},
                {
                    provide: CurrencyFormatter,
                    useValue: new CurrencyFormatter(userPreferenceStoreMock, numberFormatterMock, 'en_us')
                },
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(BooleanDetailFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have checkbox', () => {
        expect(testHostComponent).toBeTruthy();

        testHostComponent.field.value = 'true';

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            const input = testHostFixture.nativeElement.querySelector('input');
            const container = testHostFixture.nativeElement.querySelector('.checkbox-container');

            expect(container).toBeTruthy();
            expect(input).toBeTruthy();
            expect(input.checked).toBeTruthy();
            expect(input.type).toContain('checkbox');
            expect(input.disabled).toBeTruthy();
            expect(input.readOnly).toBeTruthy();
        });

    });

    it('should have update input when field changes', () => {
        expect(testHostComponent).toBeTruthy();

        testHostComponent.field.value = 'true';

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            const input = testHostFixture.nativeElement.querySelector('input');

            expect(input.checked).toBeTruthy();

            testHostComponent.field.value = 'false';

            testHostFixture.detectChanges();
            testHostFixture.whenStable().then(() => {
                expect(input.checked).toBeFalsy();
            });
        });

    });

    it('should not update field when clicked', () => {
        expect(testHostComponent).toBeTruthy();

        testHostComponent.field.value = 'false';

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {
            const input = testHostFixture.nativeElement.querySelector('input');
            input.click();

            testHostFixture.detectChanges();
            testHostFixture.whenStable().then(() => {
                expect(testHostComponent.field.value).toContain('false');
            });
        });
    });

});
