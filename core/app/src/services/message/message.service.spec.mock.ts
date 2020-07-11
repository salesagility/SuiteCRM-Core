import {MessageService} from '@services/message/message.service';

class MessageServiceSpy extends MessageService {
    constructor() {
        super();
    }

    addSuccessMessageByKey(labelKey: string): number {
        return 0;
    }

    addDangerMessageByKey(labelKey: string): number {
        return 0;
    }
}

export const messageServiceMock = new MessageServiceSpy();
