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

import {Injectable} from '@angular/core';
import {Message, MessageTypes} from 'common';
import {BehaviorSubject, Observable} from 'rxjs';
import {SystemConfigStore} from '../../store/system-config/system-config.store';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    messages$: Observable<Message[]>;
    protected messages: Message[] = [];
    protected messagesStage: BehaviorSubject<Message[]>;
    protected timeout = 3;

    constructor(public config: SystemConfigStore) {
        this.messagesStage = new BehaviorSubject<Message[]>([]);
        this.messages$ = this.messagesStage.asObservable();
        this.initTimeOut();
    }

    updateState(messages: Message[]) {
        this.messagesStage.next(this.messages = messages);
    }

    removeMessages(): void {
        this.updateState([]);
    }

    contains(message: Message, remove = false): boolean {
        let found = false;
        for (let i = 0; i < this.messages.length; i++) {
            if (message.text === this.messages[i].text) {
                found = true;
                if (remove) {
                    const messages = [...this.messages];
                    messages.splice(i, 1);
                    this.updateState(messages);
                }
                break;
            }
        }
        return found;
    }

    addMessage(message: Message): number {
        // push message only if it does not contains already...
        let ret = -1;
        if (!this.contains(message)) {
            const newMessages = [...this.messages];
            ret = newMessages.push(message);

            if (message.type === MessageTypes.success || message.type === MessageTypes.warning) {
                setTimeout(() => {
                    this.contains(message, true);
                }, this.timeout * 1000);
            }

            this.updateState(newMessages)
        }

        return ret;
    }

    addPrimaryMessage(text: string): number {
        return this.addMessage({
            type: MessageTypes.primary,
            text
        });
    }

    addSecondaryMessage(text: string): number {
        return this.addMessage({
            type: MessageTypes.secondary,
            text
        });
    }

    addSuccessMessage(text: string): number {
        return this.addMessage({
            type: MessageTypes.success,
            text
        });
    }

    addSuccessMessageByKey(labelKey: string): number {
        return this.addMessage({
            type: MessageTypes.success,
            labelKey
        });
    }

    addDangerMessage(text: string): number {
        return this.addMessage({
            type: MessageTypes.danger,
            text
        });
    }

    addDangerMessageByKey(labelKey: string): number {
        return this.addMessage({
            type: MessageTypes.danger,
            labelKey
        });
    }

    addWarningMessage(text: string): number {
        return this.addMessage({
            type: MessageTypes.warning,
            text
        });
    }

    addWarningMessageByKey(labelKey: string): number {
        return this.addMessage({
            type: MessageTypes.warning,
            labelKey
        });
    }

    addInfoMessage(text: string): number {
        return this.addMessage({
            type: MessageTypes.info,
            text
        });
    }

    addDarkMessage(text: string): number {
        return this.addMessage({
            type: MessageTypes.dark,
            text
        });
    }

    // --- LOG ---

    log(...args: any[]): void {
        console.log.apply(console, args);
    }

    error(...args: any[]): void {
        console.error.apply(console, args);
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
