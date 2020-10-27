import {Injectable} from '@angular/core';
import {SubpanelStore} from '@containers/subpanel/store/subpanel/subpanel.store';
import {RecordListStoreFactory} from '@store/record-list/record-list.store.factory';
import {LanguageStore} from '@store/language/language.store';
import {SingleValueStatisticsStoreFactory} from '@store/single-value-statistics/single-value-statistics.store.factory';

@Injectable({
    providedIn: 'root',
})
export class SubpanelStoreFactory {

    constructor(
        protected listStoreFactory: RecordListStoreFactory,
        protected languageStore: LanguageStore,
        protected statisticsStoreFactory: SingleValueStatisticsStoreFactory
    ) {
    }

    create(): SubpanelStore {
        return new SubpanelStore(this.listStoreFactory, this.languageStore, this.statisticsStoreFactory);
    }
}
