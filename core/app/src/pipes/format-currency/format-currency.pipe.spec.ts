import {FormatCurrencyPipe} from './format-currency.pipe';
import {Component} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

@Component({
    selector: 'format-currency-pipe-test-host-component',
    template: '{{value | formatCurrency:code:currencySymbol:decimalsSymbol:groupSymbol:digits}}'
})
class FormatCurrencyPipeTestHostComponent {
    value = '10';
    decimalsSymbol: string;
    groupSymbol: string;
    code: string;
    currencySymbol: string;
    digits: number;
}

describe('FormatCurrencyPipe', () => {
    let testHostComponent: FormatCurrencyPipeTestHostComponent;
    let testHostFixture: ComponentFixture<FormatCurrencyPipeTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FormatCurrencyPipeTestHostComponent,
                FormatCurrencyPipe,
            ],
            imports: [],
            providers: [],
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

        testHostComponent.decimalsSymbol = ',';
        testHostComponent.groupSymbol = '.';
        testHostComponent.code = 'USD';
        testHostComponent.currencySymbol = '$';
        testHostComponent.digits = 2;

        testHostComponent.value = '1000.500';
        testHostFixture.detectChanges();


        expect(testHostFixture.nativeElement.textContent).toContain('$1.000,50');
    });

    it('should have custom formatted value', () => {

        expect(testHostComponent).toBeTruthy();

        testHostComponent.decimalsSymbol = ',';
        testHostComponent.groupSymbol = '.';
        testHostComponent.code = 'GBP';
        testHostComponent.currencySymbol = '£';
        testHostComponent.digits = 3;

        testHostComponent.value = '1000.500';
        testHostFixture.detectChanges();


        expect(testHostFixture.nativeElement.textContent).toContain('£1.000,500');
    });
});
