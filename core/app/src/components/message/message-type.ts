import {MessageTypes} from './message-types.enum';

export interface MessageType {
    type: MessageTypes;
    text?: string;
    labelKey?: string;
}
