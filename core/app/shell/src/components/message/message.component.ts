/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

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
