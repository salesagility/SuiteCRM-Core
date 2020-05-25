import {FormatNumberPipe} from './format-number.pipe';
import {Component} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

@Component({
    selector: 'format-number-pipe-test-host-component',
    template: '{{value | formatNumber:decimalsSymbol:groupSymbol}}'
})
class FormatNumberPipeTestHostComponent {
    value = '10';
    decimalsSymbol: string;
    groupSymbol: string;
}

describe('FormatNumberPipe', () => {
    let testHostComponent: FormatNumberPipeTestHostComponent;
    let testHostFixture: ComponentFixture<FormatNumberPipeTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FormatNumberPipeTestHostComponent,
                FormatNumberPipe,
            ],
            imports: [],
            providers: [],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(FormatNumberPipeTestHostComponent);
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

    it('should have en_us formatted value', () => {

        expect(testHostComponent).toBeTruthy();
        testHostComponent.value = '10.500';
        testHostFixture.detectChanges();


        expect(testHostFixture.nativeElement.textContent).toContain('10.5');
    });

    it('should have custom formatted value', () => {

        expect(testHostComponent).toBeTruthy();

        testHostComponent.decimalsSymbol = ',';
        testHostComponent.groupSymbol = '.';

        testHostComponent.value = '1000.500';
        testHostFixture.detectChanges();


        expect(testHostFixture.nativeElement.textContent).toContain('1.000,5');
    });
});
