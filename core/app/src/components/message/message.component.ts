import {Component, OnInit} from '@angular/core';
import {MessageService} from '@services/message/message.service';
import {MessageType} from './message-type';
import {LanguageStore, LanguageStringMap, LanguageStrings} from '@store/language/language.store';
import {Observable} from 'rxjs';


@Component({
    selector: 'scrm-message-ui',
    templateUrl: './message.component.html',
    styleUrls: []
})
export class MessageUiComponent implements OnInit {

    messages: Array<MessageType> = [];

    appStrings$: Observable<LanguageStringMap>;

    constructor(
        public messageService: MessageService,
        public languages: LanguageStore
    ) {
        this.appStrings$ = languages.appStrings$;
        messageService.subscribe(this);
    }

    ngOnInit(): void {
        this.update(this.messageService.messages);
    }

    update(messages: Array<MessageType>): void {
        this.messages = messages;
    }

    close(message: MessageType): void {
        this.messageService.contains(message, true);
    }
}
