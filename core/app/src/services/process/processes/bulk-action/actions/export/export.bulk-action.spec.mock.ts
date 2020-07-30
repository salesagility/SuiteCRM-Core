import {messageServiceMock} from '@services/message/message.service.spec.mock';
import {ExportBulkAction} from '@services/process/processes/bulk-action/actions/export/export.bulk-action';

export const exportBulkActionMock = new ExportBulkAction(messageServiceMock);
