import {listStoreFactoryMock} from '../../../../store/record-list/record-list.store.spec.mock';
import {RecordListModalStoreFactory} from './record-list-modal.store.factory';
import {metadataStoreMock} from '../../../../store/metadata/metadata.store.spec.mock';

export const recordlistModalStoreFactoryMock = new RecordListModalStoreFactory(
    listStoreFactoryMock,
    metadataStoreMock
);
