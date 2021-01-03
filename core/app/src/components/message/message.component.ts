import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MessageService} from '@services/message/message.service';
import {MessageType} from './message-type';
import {LanguageStore, LanguageStringMap} from '@store/language/language.store';
import {Observable} from 'rxjs';
import {MessageTypes} from '@components/message/message-types.enum';
import {transition, trigger, useAnimation} from '@angular/animations';
import {fadeIn, fadeOut} from 'ng-animate';
import {SystemConfigStore} from '@store/system-config/system-config.store';


@Component({
    selector: 'scrm-message-ui',
    templateUrl: './message.component.html',
    styleUrls: [],
    animations: [
        trigger('fade', [
            transition(':enter', useAnimation(fadeIn, {
                params: {timing: 0.5, delay: 0}
            })),
            transition(':leave', useAnimation(fadeOut, {
                params: {timing: 0.5, delay: 0}
            })),
        ])
    ]
})
export class MessageUiComponent implements OnInit, AfterViewInit {

    messages: Array<MessageType> = [];

    appStrings$: Observable<LanguageStringMap>;
    protected timeout = 3;

    constructor(
        public messageService: MessageService,
        public languages: LanguageStore,
        public config: SystemConfigStore,
    ) {
        this.appStrings$ = languages.appStrings$;
        messageService.subscribe(this);
    }

    ngOnInit(): void {
        this.update(this.messageService.messages);
        this.initTimeOut();
    }

    ngAfterViewInit(): void {
    }

    update(messages: Array<MessageType>): void {
        this.messages = messages;

        if (!this.messages || !this.messages.length) {
            return;
        }

        this.messages.forEach(message => {
            if (message.type === MessageTypes.success || message.type === MessageTypes.warning) {
                setTimeout(() => {
                    this.messageService.contains(message, true);
                }, this.timeout * 1000);
            }
        });


    }

    close(message: MessageType): void {
        this.messageService.contains(message, true);
    }

    protected initTimeOut(): void {
        const ui = this.config.getConfigValue('ui');
        if (ui && ui.alert_timeout) {
            const parsed = parseInt(ui.alert_timeout, 10);
            if (!isNaN(parsed)) {
                this.timeout = parsed;
            }
        }
    }
}
