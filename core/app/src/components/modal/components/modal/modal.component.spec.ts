import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {systemConfigStoreMock} from '@store/system-config/system-config.store.spec.mock';
import {ButtonInterface} from '@app-common/components/button/button.model';
import {ModalModule} from '@components/modal/components/modal/modal.module';

@Component({
    selector: 'modal-test-host-component',
    template: `
        <scrm-modal [close]="closeButton"
                    [closable]="true"
                    [titleKey]="titleKey"
                    bodyKlass="test-body-modal"
                    headerKlass="test-header-modal"
                    footerKlass="test-footer-modal"
                    klass="test-modal">

            <div modal-body>
                <span class="modal-body-content">TEST BODY</span>
            </div>

            <div modal-footer>
                <span class="modal-footer-content">TEST FOOTER</span>
            </div>
        </scrm-modal>
    `
})
class ModalTestHostComponent {
    titleKey = 'LBL_NEW';
    closeClicked = 0;

    closeButton = {
        onClick: (): void => {
            this.closeClicked++;
        }
    } as ButtonInterface;
}

describe('BaseModal', () => {

    let testHostComponent: ModalTestHostComponent;
    let testHostFixture: ComponentFixture<ModalTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ModalTestHostComponent,
            ],
            imports: [
                ModalModule
            ],
            providers: [
                {provide: LanguageStore, useValue: languageStoreMock},
                {provide: SystemConfigStore, useValue: systemConfigStoreMock}
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(ModalTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have custom class', () => {
        expect(testHostComponent).toBeTruthy();
        const wrapper = testHostFixture.nativeElement.getElementsByClassName('test-modal');

        expect(wrapper).toBeTruthy();
        expect(wrapper.length).toEqual(1);
    });

    it('should have custom modal header class', () => {
        expect(testHostComponent).toBeTruthy();
        const header = testHostFixture.nativeElement.getElementsByClassName('modal-header');

        expect(header).toBeTruthy();
        expect(header.length).toEqual(1);

        expect(header.item(0).className).toContain('test-header-modal');
    });

    it('should have title', () => {
        expect(testHostComponent).toBeTruthy();
        const header = testHostFixture.nativeElement.getElementsByClassName('modal-header');

        expect(header).toBeTruthy();
        expect(header.length).toEqual(1);

        const title = header.item(0).getElementsByClassName('modal-title');

        expect(title).toBeTruthy();
        expect(title.length).toEqual(1);

        expect(title.item(0).textContent).toContain('New');

    });

    it('should have clickable close button', () => {
        expect(testHostComponent).toBeTruthy();
        const header = testHostFixture.nativeElement.getElementsByClassName('modal-header');

        expect(header).toBeTruthy();
        expect(header.length).toEqual(1);

        const close = header.item(0).getElementsByTagName('scrm-close-button');

        expect(close).toBeTruthy();
        expect(close.length).toEqual(1);

        const button = close.item(0).getElementsByTagName('button');

        expect(button).toBeTruthy();
        expect(button.length).toEqual(1);

        button.item(0).click();

        expect(testHostComponent.closeClicked).toEqual(1);

    });

    it('should have custom body class', () => {
        expect(testHostComponent).toBeTruthy();
        const body = testHostFixture.nativeElement.getElementsByClassName('modal-body');

        expect(body).toBeTruthy();
        expect(body.length).toEqual(1);

        expect(body.item(0).className).toContain('test-body-modal');
    });

    it('should have body', () => {
        expect(testHostComponent).toBeTruthy();
        const body = testHostFixture.nativeElement.getElementsByClassName('modal-body');

        expect(body).toBeTruthy();
        expect(body.length).toEqual(1);

        const projectedContent = body.item(0).getElementsByClassName('modal-body-content');

        expect(projectedContent).toBeTruthy();
        expect(projectedContent.length).toEqual(1);

        expect(projectedContent.item(0).textContent).toContain('TEST BODY');
    });

    it('should have custom footer class', () => {
        expect(testHostComponent).toBeTruthy();
        const footer = testHostFixture.nativeElement.getElementsByClassName('modal-footer');

        expect(footer).toBeTruthy();
        expect(footer.length).toEqual(1);

        expect(footer.item(0).className).toContain('test-footer-modal');
    });

    it('should have footer', () => {
        expect(testHostComponent).toBeTruthy();
        const footer = testHostFixture.nativeElement.getElementsByClassName('modal-footer');

        expect(footer).toBeTruthy();
        expect(footer.length).toEqual(1);

        const projectedContent = footer.item(0).getElementsByClassName('modal-footer-content');

        expect(projectedContent).toBeTruthy();
        expect(projectedContent.length).toEqual(1);

        expect(projectedContent.item(0).textContent).toContain('TEST FOOTER');
    });

});
