import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {EnumDetailFieldComponent} from './enum.component';
import {Field} from '@app-common/record/field.model';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {BehaviorSubject, of, Subscription} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {userPreferenceStoreMock} from '@store/user-preference/user-preference.store.spec.mock';
import {NumberFormatter} from '@services/formatters/number/number-formatter.service';
import {numberFormatterMock} from '@services/formatters/number/number-formatter.spec.mock';
import {DatetimeFormatter} from '@services/formatters/datetime/datetime-formatter.service';
import {datetimeFormatterMock} from '@services/formatters/datetime/datetime-formatter.service.spec.mock';
import {DateFormatter} from '@services/formatters/datetime/date-formatter.service';
import {dateFormatterMock} from '@services/formatters/datetime/date-formatter.service.spec.mock';
import {CurrencyFormatter} from '@services/formatters/currency/currency-formatter.service';

const field: Field = {
    type: 'enum',
    value: '_customer',
    metadata: null,
    definition: {
        options: 'account_type_dom'
    }
};
const fieldState = new BehaviorSubject<Field>(field);
const field$ = fieldState.asObservable();

@Component({
    selector: 'enum-detail-field-test-host-component',
    template: `
        <scrm-enum-detail *ngIf="field.definition && field.definition.options" [field]="field"></scrm-enum-detail>
        <scrm-enum-detail *ngIf="field.metadata && field.metadata.options$" [field]="field"></scrm-enum-detail>
    `
})
class EnumDetailFieldTestHostComponent implements OnInit, OnDestroy {
    field: Field;
    sub: Subscription;

    ngOnInit(): void {
        this.sub = field$.subscribe(value => {
            this.field = value;
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

}

describe('EnumDetailFieldComponent', () => {
    let testHostComponent: EnumDetailFieldTestHostComponent;
    let testHostFixture: ComponentFixture<EnumDetailFieldTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                EnumDetailFieldTestHostComponent,
                EnumDetailFieldComponent,
            ],
            imports: [],
            providers: [
                {provide: LanguageStore, useValue: languageStoreMock},
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

        testHostFixture = TestBed.createComponent(EnumDetailFieldTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have value', () => {
        expect(testHostComponent).toBeTruthy();
        expect(testHostComponent).toBeTruthy();

        fieldState.next({
            type: 'enum',
            value: '_customer',
            definition: {
                options: 'account_type_dom'
            }
        });

        testHostFixture.detectChanges();
        testHostFixture.whenRenderingDone().then(() => {
            expect(testHostFixture.nativeElement.textContent).toContain('Customer');
            expect(testHostFixture.nativeElement.textContent).not.toContain('_customer');
        });

    });

    it('should allow providing option list', () => {
        expect(testHostComponent).toBeTruthy();
        fieldState.next({
            type: 'enum',
            value: '_extra',
            metadata: {
                options$: of([
                    {
                        value: '_customer',
                        label: 'Customer',
                    },
                    {
                        value: '_reseller',
                        label: 'Reseller',
                    },
                    {
                        value: '_extra',
                        label: 'Extra',
                    },
                ]).pipe(shareReplay(1))
            },
        });

        testHostFixture.detectChanges();
        testHostFixture.whenRenderingDone().then(() => {

            expect(testHostFixture.nativeElement.textContent).toContain('Extra');
            expect(testHostFixture.nativeElement.textContent).not.toContain('_extra');
        });
    });
});
