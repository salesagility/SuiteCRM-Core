import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {BehaviorSubject, of} from 'rxjs';
import {CurrencyDetailFieldComponent} from './currency.component';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {distinctUntilChanged} from 'rxjs/operators';
import {FormatCurrencyPipe} from '@base/pipes/format-currency/format-currency.pipe';

@Component({
    selector: 'currency-detail-field-test-host-component',
    template: '<scrm-currency-detail [value]="value"></scrm-currency-detail>'
})
class CurrencyDetailFieldTestHostComponent {
    value = '10';
}

describe('CurrencyDetailFieldComponent', () => {
    let testHostComponent: CurrencyDetailFieldTestHostComponent;
    let testHostFixture: ComponentFixture<CurrencyDetailFieldTestHostComponent>;

    /* eslint-disable camelcase, @typescript-eslint/camelcase */
    const preferences = new BehaviorSubject({
        num_grp_sep: ',',
        dec_sep: '.',
        currency: {id: '-99', name: 'US Dollars', symbol: '$', iso4217: 'USD'},
        default_currency_significant_digits: 2
    });
    /* eslint-enable camelcase, @typescript-eslint/camelcase */

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                CurrencyDetailFieldTestHostComponent,
                CurrencyDetailFieldComponent,
                FormatCurrencyPipe
            ],
            imports: [],
            providers: [
                {
                    provide: UserPreferenceStore, useValue: {
                        userPreferences$: preferences.asObservable().pipe(distinctUntilChanged())
                    }
                },
                {
                    /* eslint-disable camelcase, @typescript-eslint/camelcase */
                    provide: SystemConfigStore, useValue: {
                        configs$: of({
                            default_number_grouping_seperator: {
                                id: '/docroot/api/system-configs/default_number_grouping_seperator',
                                _id: 'default_number_grouping_seperator',
                                value: ';',
                                items: []
                            },
                            default_decimal_seperator: {
                                id: '/docroot/api/system-configs/default_decimal_seperator',
                                _id: 'default_decimal_seperator',
                                value: ',',
                                items: []
                            },
                            currency: {
                                id: '/docroot/api/system-configs/currency',
                                _id: 'currency',
                                value: null,
                                items: {
                                    id: '-99',
                                    name: 'US Dollars',
                                    symbol: '$',
                                    iso4217: 'USD'
                                }
                            },
                            default_currency_significant_digits: {
                                id: '/docroot/api/system-configs/default_currency_significant_digits',
                                _id: 'default_currency_significant_digits',
                                value: 3,
                                items: []
                            }
                        })
                    }
                }
                /* eslint-enable camelcase, @typescript-eslint/camelcase */
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(CurrencyDetailFieldTestHostComponent);
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

        /* eslint-disable camelcase, @typescript-eslint/camelcase */
        preferences.next({
            num_grp_sep: ',',
            dec_sep: '.',
            currency: {id: '-99', name: 'US Dollars', symbol: '$', iso4217: 'USD'},
            default_currency_significant_digits: 2
        });
        /* eslint-enable camelcase, @typescript-eslint/camelcase */

        testHostComponent.value = '10.500';
        testHostFixture.detectChanges();


        expect(testHostFixture.nativeElement.textContent).toContain('$10.50');
    });

    it('should have custom formatted currency', () => {

        expect(testHostComponent).toBeTruthy();

        /* eslint-disable camelcase, @typescript-eslint/camelcase */
        preferences.next({
            num_grp_sep: '.',
            dec_sep: ',',
            currency: {id: '1', name: 'Stirling Pound', symbol: '£', iso4217: 'GBP'},
            default_currency_significant_digits: 2
        });
        /* eslint-enable camelcase, @typescript-eslint/camelcase */

        testHostComponent.value = '1000.500';
        testHostFixture.detectChanges();


        expect(testHostFixture.nativeElement.textContent).toContain('£1.000,50');
    });

    it('should have system config based formatted value', () => {

        expect(testHostComponent).toBeTruthy();

        /* eslint-disable camelcase, @typescript-eslint/camelcase */
        preferences.next({
            num_grp_sep: null,
            dec_sep: null,
            currency: null,
            default_currency_significant_digits: null
        });
        /* eslint-enable camelcase, @typescript-eslint/camelcase */

        testHostComponent.value = '2000.500';
        testHostFixture.detectChanges();
        testHostFixture.detectChanges();


        expect(testHostFixture.nativeElement.textContent).toContain('$2;000,500');
    });
});
