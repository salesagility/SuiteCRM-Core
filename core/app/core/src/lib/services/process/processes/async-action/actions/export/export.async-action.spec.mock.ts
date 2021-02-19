import {messageServiceMock} from '../../../../../message/message.service.spec.mock';
import {ExportAsyncAction} from './export.async-action';

export const exportBulkActionMock = new ExportAsyncAction(messageServiceMock);
