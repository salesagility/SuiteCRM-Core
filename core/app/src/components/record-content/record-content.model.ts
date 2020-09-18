import {ViewMode} from '@app-common/views/view.model';
import {TabDefinitions} from '@store/metadata/metadata.store.service';
import {Observable} from 'rxjs';
import {Panel} from '@app-common/metadata/metadata.model';
import {Record} from '@app-common/record/record.model';

export interface RecordContentDataSource {
    getDisplayConfig(): Observable<RecordContentConfig>;

    getPanels(): Observable<Panel[]>;

    getRecord(): Observable<Record>;
}

export interface RecordContentConfig {
    layout: 'tabs' | 'panels';
    mode: ViewMode;
    maxColumns: number;
    tabDefs: TabDefinitions;
}
