import {RecordListModalStoreFactory} from '@containers/record-list-modal/store/record-list-modal/record-list-modal.store.factory';
import {metadataStoreMock} from '@store/metadata/metadata.store.spec.mock';
import {listStoreFactoryMock} from '@store/record-list/record-list.store.spec.mock';

export const recordlistModalStoreFactoryMock = new RecordListModalStoreFactory(
    listStoreFactoryMock,
    metadataStoreMock
);
