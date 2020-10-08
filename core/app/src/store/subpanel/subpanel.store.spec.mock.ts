import {SubpanelStoreFactory} from '@store/subpanel/subpanel.store.factory';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {listStoreFactoryMock} from '@store/record-list/record-list.store.spec.mock';

export const subpanelFactoryMock = new SubpanelStoreFactory(
    listStoreFactoryMock,
    languageStoreMock
);
