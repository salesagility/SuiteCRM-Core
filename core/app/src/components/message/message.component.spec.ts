import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MessageUiComponent} from './message.component';
import {LanguageStore} from '@store/language/language.store';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {systemConfigStoreMock} from '@store/system-config/system-config.store.spec.mock';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {MessageService} from '@services/message/message.service';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';


const messageService = new MessageService();

describe('MessageComponent', () => {
    let component: MessageUiComponent;
    let fixture: ComponentFixture<MessageUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MessageUiComponent],
            providers: [
                {provide: LanguageStore, useValue: languageStoreMock},
                {provide: SystemConfigStore, useValue: systemConfigStoreMock},
                {provide: MessageService, useValue: messageService},
            ],
            imports: [
                ApolloTestingModule,
                NoopAnimationsModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MessageUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    const checkAlertRender = (el): any => {
        const wrapper = el.getElementsByClassName('message-wrapper').item(0);

        expect(wrapper).toBeTruthy();

        const container = el.getElementsByClassName('message-container').item(0);

        expect(container).toBeTruthy();

        const messages = el.getElementsByClassName('message');

        expect(messages).toBeTruthy();
        expect(messages.length).toEqual(1);
        expect(messages.item(0).className).toContain('alert-dismissible');
        const close = messages.item(0).getElementsByClassName('close').item(0);

        expect(close).toBeTruthy();
        return messages;
    };

    it('should have success message', () => {
        expect(component).toBeTruthy();
        messageService.removeMessages();
        messageService.addSuccessMessage('Success Message');

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const el = fixture.nativeElement;
            const messages = checkAlertRender(el);

            expect(messages.item(0).className).toContain('success');

            expect(messages.item(0).textContent).toContain('Success Message');
        });
    });

    it('should have error message', () => {
        expect(component).toBeTruthy();
        messageService.removeMessages();
        messageService.addDangerMessage('Error Message');

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const el = fixture.nativeElement;
            const messages = checkAlertRender(el);

            expect(messages.item(0).className).toContain('danger');
            expect(messages.item(0).textContent).toContain('Error Message');
        });
    });

    it('should have info message', () => {
        expect(component).toBeTruthy();
        messageService.removeMessages();
        messageService.addInfoMessage('Info Message');

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const el = fixture.nativeElement;
            const messages = checkAlertRender(el);

            expect(messages.item(0).className).toContain('info');
            expect(messages.item(0).textContent).toContain('Info Message');
        });
    });

    it('should have primary message', () => {
        expect(component).toBeTruthy();
        messageService.removeMessages();
        messageService.addPrimaryMessage('Primary Message');

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const el = fixture.nativeElement;
            const messages = checkAlertRender(el);

            expect(messages.item(0).className).toContain('primary');
            expect(messages.item(0).textContent).toContain('Primary Message');
        });
    });

    it('should have dark message', () => {
        expect(component).toBeTruthy();
        messageService.removeMessages();
        messageService.addDarkMessage('Dark Message');

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const el = fixture.nativeElement;
            const messages = checkAlertRender(el);

            expect(messages.item(0).className).toContain('dark');
            expect(messages.item(0).textContent).toContain('Dark Message');
        });
    });

    it('should have secondary message', () => {
        expect(component).toBeTruthy();
        messageService.removeMessages();
        messageService.addSecondaryMessage('Secondary Message');

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const el = fixture.nativeElement;
            const messages = checkAlertRender(el);

            expect(messages.item(0).className).toContain('secondary');
            expect(messages.item(0).textContent).toContain('Secondary Message');
        });
    });

    it('should have warning message', () => {
        expect(component).toBeTruthy();
        messageService.removeMessages();
        messageService.addWarningMessage('Warning Message');

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const el = fixture.nativeElement;
            const messages = checkAlertRender(el);

            expect(messages.item(0).className).toContain('warning');
            expect(messages.item(0).textContent).toContain('Warning Message');
        });
    });

    it('should close when clicking button', () => {
        expect(component).toBeTruthy();
        messageService.removeMessages();
        messageService.addWarningMessage('Warning Message');

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const el = fixture.nativeElement;
            const messages = checkAlertRender(el);

            expect(messages.item(0).className).toContain('warning');
            expect(messages.item(0).textContent).toContain('Warning Message');

            const close = messages.item(0).getElementsByClassName('close').item(0);
            close.click();

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const newMessage = el.getElementsByClassName('message');

                expect(newMessage).toBeTruthy();
                expect(newMessage.length).toEqual(0);
            });
        });
    });

    it('should close when clicking alert', () => {
        expect(component).toBeTruthy();
        messageService.removeMessages();
        messageService.addWarningMessage('Warning Message');

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const el = fixture.nativeElement;
            const messages = checkAlertRender(el);

            expect(messages.item(0).className).toContain('warning');
            expect(messages.item(0).textContent).toContain('Warning Message');

            messages.item(0).click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const newMessage = el.getElementsByClassName('message');

                expect(newMessage).toBeTruthy();
                expect(newMessage.length).toEqual(0);
            });
        });
    });
});
