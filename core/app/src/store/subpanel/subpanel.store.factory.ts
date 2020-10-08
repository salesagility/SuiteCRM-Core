import {Injectable} from '@angular/core';
import {SubpanelStore} from '@store/subpanel/subpanel.store';
import {RecordListStoreFactory} from '@store/record-list/record-list.store.factory';
import {LanguageStore} from '@store/language/language.store';

@Injectable({
    providedIn: 'root',
})
export class SubpanelStoreFactory {

    constructor(
        protected listStoreFactory: RecordListStoreFactory,
        protected languageStore: LanguageStore,
    ) {
    }

    create(): SubpanelStore {
        return new SubpanelStore(this.listStoreFactory, this.languageStore);
    }
}
