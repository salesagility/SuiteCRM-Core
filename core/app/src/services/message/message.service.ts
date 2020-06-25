import {Injectable} from '@angular/core';
import {MessageType} from '@components/message/message-type';
import {MessageTypes} from '@components/message/message-types.enum';
import {MessageUiComponent} from '@components/message/message.component';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    messages: Array<MessageType> = [];
    messageComponent?: MessageUiComponent;

    constructor() {
    }

    subscribe(messageComponent: MessageUiComponent): void {
        this.messageComponent = messageComponent;
        this.messageComponent.update(this.messages);
    }

    removeMessages(): void {
        this.messages = [];
        if (this.messageComponent) {
            this.messageComponent.update(this.messages);
        }
    }

    contains(message: MessageType, remove = false): boolean {
        let found = false;
        for (let i = 0; i < this.messages.length; i++) {
            if (message.text === this.messages[i].text) {
                found = true;
                if (remove) {
                    this.messages.splice(i, 1);
                }
                break;
            }
        }
        return found;
    }

    addMessage(message: MessageType): number {
        // push message only if it does not contains already...
        let ret = -1;
        if (!this.contains(message)) {
            ret = this.messages.push(message);
            if (this.messageComponent) {
                this.messageComponent.update(this.messages);
            }
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
}
