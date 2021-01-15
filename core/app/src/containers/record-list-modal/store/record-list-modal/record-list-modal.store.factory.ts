import {Injectable} from '@angular/core';
import {RecordListStoreFactory} from '@store/record-list/record-list.store.factory';
import {RecordListModalStore} from '@containers/record-list-modal/store/record-list-modal/record-list-modal.store';
import {MetadataStore} from '@store/metadata/metadata.store.service';

@Injectable({
    providedIn: 'root',
})
export class RecordListModalStoreFactory {

    constructor(
        protected listStoreFactory: RecordListStoreFactory,
        protected metadataStore: MetadataStore,
    ) {
    }

    create(): RecordListModalStore {
        return new RecordListModalStore(this.listStoreFactory, this.metadataStore);
    }
}
