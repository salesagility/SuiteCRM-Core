import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {MessageModalComponent} from './message-modal.component';
import {MessageModalModule} from '@components/modal/components/message-modal/message-modal.module';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {systemConfigStoreMock} from '@store/system-config/system-config.store.spec.mock';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Component, OnInit} from '@angular/core';
import {ModalButtonInterface} from '@app-common/components/modal/modal.model';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {interval} from 'rxjs';
import {take} from 'rxjs/operators';

@Component({
    selector: 'messages-modal-test-host-component',
    template: '<div></div>'
})
class MessageModalTestHostComponent implements OnInit {
    modal: NgbModalRef;
    cancelClicked = 0;
    okClicked = 0;

    constructor(public modalService: NgbModal) {
    }

    ngOnInit(): void {
        this.modal = this.modalService.open(MessageModalComponent);

        this.modal.componentInstance.textKey = 'WARN_UNSAVED_CHANGES';
        this.modal.componentInstance.buttons = [
            {
                labelKey: 'LBL_CANCEL',
                klass: ['btn-secondary'],
                onClick: activeModal => {
                    this.cancelClicked++;
                    activeModal.dismiss();
                }
            } as ModalButtonInterface,
            {
                labelKey: 'LBL_OK',
                klass: ['btn-main'],
                onClick: activeModal => {
                    this.okClicked++;
                    activeModal.close();
                }
            } as ModalButtonInterface,
        ];
    }
}

describe('MessageModalComponent', () => {
    let component: MessageModalTestHostComponent;
    let fixture: ComponentFixture<MessageModalTestHostComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [MessageModalTestHostComponent],
            imports: [
                MessageModalModule,
                NoopAnimationsModule
            ],
            providers: [
                {provide: LanguageStore, useValue: languageStoreMock},
                {provide: SystemConfigStore, useValue: systemConfigStoreMock}
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MessageModalTestHostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should have modal', () => {
        expect(component).toBeTruthy();

        const modal = document.getElementsByClassName('message-modal');

        expect(modal).toBeTruthy();
        expect(modal.length).toBeTruthy();
        component.modal.close();
    });

    it('should have message', async (done) => {
        expect(component).toBeTruthy();

        fixture.detectChanges();
        await fixture.whenRenderingDone();

        await interval(1000).pipe(take(1)).toPromise();

        const modal = document.getElementsByClassName('message-modal');

        expect(modal).toBeTruthy();
        expect(modal.length).toBeTruthy();

        const body = modal.item(0).getElementsByClassName('modal-body');

        expect(body).toBeTruthy();
        expect(body.length).toBeTruthy();

        expect(body.item(0).textContent).toContain('Are you sure you want to navigate away from this record?');

        component.modal.close();
        done();
    });

    it('should have a clickable cancel button', async (done) => {
        expect(component).toBeTruthy();

        fixture.detectChanges();
        await fixture.whenRenderingDone();

        await interval(1000).pipe(take(1)).toPromise();

        const modal = document.getElementsByClassName('message-modal');

        expect(modal).toBeTruthy();
        expect(modal.length).toBeTruthy();

        const footer = modal.item(0).getElementsByClassName('modal-footer');

        expect(footer).toBeTruthy();
        expect(footer.length).toBeTruthy();

        const buttons = footer.item(0).getElementsByTagName('button');

        expect(buttons).toBeTruthy();
        expect(buttons.length).toEqual(2);

        const cancelButton = buttons.item(0);

        expect(cancelButton.textContent).toContain('Cancel');
        expect(cancelButton.className).toContain('btn-secondary');

        cancelButton.click();

        fixture.detectChanges();
        await fixture.whenRenderingDone();

        await interval(1000).pipe(take(1)).toPromise();

        expect(component.cancelClicked).toEqual(1);

        done();
    });

    it('should have a clickable ok button', async (done) => {
        expect(component).toBeTruthy();

        fixture.detectChanges();
        await fixture.whenRenderingDone();

        await interval(1000).pipe(take(1)).toPromise();

        const modal = document.getElementsByClassName('message-modal');

        expect(modal).toBeTruthy();
        expect(modal.length).toBeTruthy();

        const footer = modal.item(0).getElementsByClassName('modal-footer');

        expect(footer).toBeTruthy();
        expect(footer.length).toBeTruthy();

        const buttons = footer.item(0).getElementsByTagName('button');

        expect(buttons).toBeTruthy();
        expect(buttons.length).toEqual(2);

        const okButton = buttons.item(1);

        expect(okButton.textContent).toContain('OK');
        expect(okButton.className).toContain('btn-main');

        okButton.click();

        expect(component.okClicked).toEqual(1);

        fixture.detectChanges();
        await fixture.whenRenderingDone();

        await interval(1000).pipe(take(1)).toPromise();

        done();
    });

});
