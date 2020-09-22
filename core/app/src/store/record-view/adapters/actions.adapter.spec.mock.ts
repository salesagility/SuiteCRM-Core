import {RecordActionsAdapter} from '@store/record-view/adapters/actions.adapter';
import {recordviewStoreMock} from '@store/record-view/record-view.store.spec.mock';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {metadataStoreMock} from '@store/metadata/metadata.store.spec.mock';
import {recordActionsManagerMock} from '@views/record/actions/record-action-manager.service.spec.mock';


export const recordActionsMock = new RecordActionsAdapter(
    recordviewStoreMock,
    metadataStoreMock,
    languageStoreMock,
    recordActionsManagerMock
);
