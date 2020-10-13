import {Injectable} from '@angular/core';
import {SubpanelStore} from '@store/subpanel/subpanel.store';
import {RecordListStoreFactory} from '@store/record-list/record-list.store.factory';
import {LanguageStore} from '@store/language/language.store';
import {SubpanelStatisticsStoreFactory} from '@store/subpanel/subpanel-statistics.store.factory';

@Injectable({
    providedIn: 'root',
})
export class SubpanelStoreFactory {

    constructor(
        protected listStoreFactory: RecordListStoreFactory,
        protected languageStore: LanguageStore,
        protected statisticsStoreFactory: SubpanelStatisticsStoreFactory
    ) {
    }

    create(): SubpanelStore {
        return new SubpanelStore(this.listStoreFactory, this.languageStore, this.statisticsStoreFactory);
    }
}
