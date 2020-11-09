import {FormatCurrencyPipe} from './format-currency.pipe';
import {Component} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {NumberFormatter} from '@services/formatters/number/number-formatter.service';
import {BehaviorSubject} from 'rxjs';
import {UserPreferenceMockStore} from '@store/user-preference/user-preference.store.spec.mock';
import {CurrencyFormatter} from '@services/formatters/currency/currency-formatter.service';

@Component({
    selector: 'format-currency-pipe-test-host-component',
    template: '{{value | formatCurrency}}'
})
class FormatCurrencyPipeTestHostComponent {
    value = '10';
}

describe('FormatCurrencyPipe', () => {
    let testHostComponent: FormatCurrencyPipeTestHostComponent;
    let testHostFixture: ComponentFixture<FormatCurrencyPipeTestHostComponent>;

    /* eslint-disable camelcase,@typescript-eslint/camelcase */
    const preferences = new BehaviorSubject<any>({
        currency: {id: '1', name: 'US Dollar', symbol: '$', iso4217: 'USD'},
        default_currency_significant_digits: '2',
        num_grp_sep: ',',
        dec_sep: '.',
    });

    const mockStore = new UserPreferenceMockStore(preferences);
    const mockNumberFormatter = new NumberFormatter(mockStore, 'en_us');
    /* eslint-enable camelcase,@typescript-eslint/camelcase */

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FormatCurrencyPipeTestHostComponent,
                FormatCurrencyPipe,
            ],
            imports: [],
            providers: [
                {
                    provide: UserPreferenceStore, useValue: mockStore
                },
                {
                    provide: NumberFormatter, useValue: mockNumberFormatter
                },
                {
                    provide: CurrencyFormatter, useValue: new CurrencyFormatter(mockStore, mockNumberFormatter, 'en_us')
                }
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(FormatCurrencyPipeTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have value', () => {

        expect(testHostComponent).toBeTruthy();
        expect(testHostFixture.nativeElement.textContent).toContain(10);
    });

    it('should have dollar formatted currency', () => {

        expect(testHostComponent).toBeTruthy();

        /* eslint-disable camelcase,@typescript-eslint/camelcase */
        preferences.next({
            currency: {id: '1', name: 'US Dollar', symbol: '$', iso4217: 'USD'},
            default_currency_significant_digits: '2',
            num_grp_sep: '.',
            dec_sep: ',',
        });
        /* eslint-enable camelcase,@typescript-eslint/camelcase */

        testHostComponent.value = '1000.500';
        testHostFixture.detectChanges();

        testHostFixture.whenStable().then(() => {
            expect(testHostFixture.nativeElement.textContent).toContain('$1.000,50');
        });


    });

    it('should have custom formatted value', () => {

        expect(testHostComponent).toBeTruthy();

        /* eslint-disable camelcase,@typescript-eslint/camelcase */
        preferences.next({
            currency: {id: '1', name: 'Pounds', symbol: '£', iso4217: 'GBP'},
            default_currency_significant_digits: '3',
            num_grp_sep: '.',
            dec_sep: ',',
        });
        /* eslint-enable camelcase,@typescript-eslint/camelcase */

        testHostComponent.value = '1000.500';
        testHostFixture.detectChanges();


        testHostFixture.whenStable().then(() => {
            expect(testHostFixture.nativeElement.textContent).toContain('£1.000,500');
        });
    });
});
