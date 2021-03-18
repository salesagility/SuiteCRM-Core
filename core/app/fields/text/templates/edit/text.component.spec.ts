import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Component} from '@angular/core';
import {Field} from '@app-common/record/field.model';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';
import {NumberFormatter} from '@services/formatters/number/number-formatter.service';
import {numberFormatterMock} from '@services/formatters/number/number-formatter.spec.mock';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';
import {datetimeFormatterMock} from '@services/formatters/datetime/datetime-formatter.service.spec.mock';
import {DateFormatter} from '@services/formatters/datetime/date-formatter.service';
import {dateFormatterMock} from '@services/formatters/datetime/date-formatter.service.spec.mock';
import {CurrencyFormatter} from '@services/formatters/currency/currency-formatter.service';
import {FormControl} from '@angular/forms';
import {TextEditFieldModule} from '@fields/text/templates/edit/text.module';

@Component({
    selector: 'text-edit-field-test-host-component',
    template: '<scrm-text-edit [field]="field"></scrm-text-edit>'
})
class TextEditFieldTestHostComponent {
    field: Field = {
        type: 'text',
        value: 'My Text',
        metadata: null,
        formControl: new FormControl('My Text')
    };
}

describe('TextEditFieldComponent', () => {
    let testHostComponent: TextEditFieldTestHostComponent;
    let testHostFixture: ComponentFixture<TextEditFieldTestHostComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                TextEditFieldTestHostComponent,
            ],
            imports: [
                TextEditFieldModule
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

        testHostFixture = TestBed.createComponent(TextEditFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have value', () => {
        expect(testHostComponent).toBeTruthy();


        const field = testHostFixture.nativeElement.getElementsByTagName('textarea').item(0);

        expect(field).toBeTruthy();

        expect(field.value).toContain('My Text');
    });

    it('should have default rows 6', () => {
        const el = testHostFixture.nativeElement.querySelector('textarea');

        expect(testHostComponent).toBeTruthy();
        expect(el).toBeTruthy();
        expect(el.rows).toEqual(6);
    });

    it('should have default cols 20', () => {
        const el = testHostFixture.nativeElement.querySelector('textarea');

        expect(testHostComponent).toBeTruthy();
        expect(el).toBeTruthy();
        expect(el.cols).toEqual(20);
    });
});
