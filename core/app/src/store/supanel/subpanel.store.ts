import {Injectable} from '@angular/core';
import {StateStore} from '@store/state';
import {RecordList, RecordListStore} from '@store/record-list/record-list.store';
import {BehaviorSubject, Observable} from 'rxjs';
import {RecordListStoreFactory} from '@store/record-list/record-list.store.factory';
import {LanguageStore} from '@store/language/language.store';
import {SubPanel} from '@app-common/metadata/subpanel.metadata.model';

export interface SubpanelStoreMap {
    [key: string]: SubpanelStore;
}

@Injectable()
export class SubpanelStore implements StateStore {
    show = false;
    parentModule: string;
    recordList: RecordListStore;
    metadata$: Observable<SubPanel>;
    metadata: SubPanel;
    protected metadataState: BehaviorSubject<SubPanel>;

    constructor(
        protected listStoreFactory: RecordListStoreFactory,
        protected languageStore: LanguageStore
    ) {
        this.recordList = listStoreFactory.create();
        this.metadataState = new BehaviorSubject<SubPanel>({} as SubPanel);
        this.metadata$ = this.metadataState.asObservable();
    }

    getTitle(): string {
        return this.languageStore.getFieldLabel(this.metadata.title_key, this.parentModule);
    }

    getIcon(): string {
        return this.metadata.icon;
    }

    clear(): void {
        this.recordList.clear();
    }

    clearAuthBased(): void {
        this.recordList.clearAuthBased();
    }

    /**
     * Initial list records load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} parentModule name
     * @param {object} meta to use
     * @returns {object} Observable<any>
     */
    public init(parentModule: string, meta: SubPanel): Observable<RecordList> {
        this.parentModule = parentModule;
        this.metadata = meta;
        this.metadataState.next(this.metadata);
        this.recordList.init(meta.module, false);

        this.initSearchCriteria();

        // TODO return this.load();
        return null;
    }

    /**
     * Init search criteria
     */
    protected initSearchCriteria(): void {
    }

    /**
     * Load / reload records using current pagination and criteria
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<ListViewState>
     */
    protected load(useCache = true): Observable<RecordList> {

        return this.recordList.load(useCache);
    }
}
