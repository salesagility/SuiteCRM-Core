import {Injectable} from '@angular/core';
import {ListGQL} from '@store/record-list/graphql/api.list.get';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';
import {AppStateStore} from '@store/app-state/app-state.store';
import {LanguageStore} from '@store/language/language.store';
import {MessageService} from '@services/message/message.service';
import {RecordListStore} from '@store/record-list/record-list.store';

@Injectable({
    providedIn: 'root',
})
export class RecordListStoreFactory {

    constructor(
        protected listGQL: ListGQL,
        protected configStore: SystemConfigStore,
        protected preferencesStore: UserPreferenceStore,
        protected appStateStore: AppStateStore,
        protected languageStore: LanguageStore,
        protected message: MessageService,
    ) {
    }

    create(): RecordListStore {
        return new RecordListStore(
            this.listGQL,
            this.configStore,
            this.preferencesStore,
            this.appStateStore,
            this.languageStore,
            this.message
        );
    }
}
