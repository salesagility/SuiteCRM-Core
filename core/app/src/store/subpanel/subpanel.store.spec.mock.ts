import {SubpanelStoreFactory} from '@store/subpanel/subpanel.store.factory';
import {languageStoreMock} from '@store/language/language.store.spec.mock';
import {listStoreFactoryMock} from '@store/record-list/record-list.store.spec.mock';
import {subpanelStatisticsFactoryMock} from '@store/subpanel/subpanel-statistics.store.spec.mock';

export const subpanelFactoryMock = new SubpanelStoreFactory(
    listStoreFactoryMock,
    languageStoreMock,
    subpanelStatisticsFactoryMock
);
