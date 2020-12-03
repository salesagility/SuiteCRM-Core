import {HtmlSanitizePipe} from './html-sanitize.pipe';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {Component} from '@angular/core';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';

@Component({
    selector: 'html-sanitize-test-host-component',
    template: '<span [innerHTML]="value | htmlSanitize"></span>'
})
class HtmlSanitizePipeTestHostComponent {
    value = 'V8 Api test Account &amp;&ccedil;!&quot;#$%&amp;/`&agrave;';
}

describe('HtmlSanitizePipe', () => {
    let testHostComponent: HtmlSanitizePipeTestHostComponent;
    let testHostFixture: ComponentFixture<HtmlSanitizePipeTestHostComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                HtmlSanitizePipeTestHostComponent,
                HtmlSanitizePipe,
            ],
            imports: [BrowserDynamicTestingModule],
            providers: [],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(HtmlSanitizePipeTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('create an instance', () => {
        expect(testHostComponent).toBeTruthy();
        expect(testHostFixture.nativeElement.textContent).toContain('V8 Api test Account &ç!"#$%&/`à');
    });
});
