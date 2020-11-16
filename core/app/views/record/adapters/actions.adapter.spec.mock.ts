import {RecordActionsAdapter} from '@views/record/adapters/actions.adapter';
import {recordviewStoreMock} from '@views/record/store/record-view/record-view.store.spec.mock';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {metadataStoreMock} from '@store/metadata/metadata.store.spec.mock';
import {recordActionsManagerMock} from '@views/record/actions/record-action-manager.service.spec.mock';
import {bulkActionProcessMock} from '@services/process/processes/async-action/async-action.spec.mock';
import {messageServiceMock} from '@services/message/message.service.spec.mock';


export const recordActionsMock = new RecordActionsAdapter(
    recordviewStoreMock,
    metadataStoreMock,
    languageStoreMock,
    recordActionsManagerMock,
    bulkActionProcessMock,
    messageServiceMock
);
