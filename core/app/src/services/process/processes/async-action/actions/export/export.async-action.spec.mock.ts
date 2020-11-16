import {messageServiceMock} from '@services/message/message.service.spec.mock';
import {ExportAsyncAction} from '@services/process/processes/async-action/actions/export/export.async-action';

export const exportBulkActionMock = new ExportAsyncAction(messageServiceMock);
