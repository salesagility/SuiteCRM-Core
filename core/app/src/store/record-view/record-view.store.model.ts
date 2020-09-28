import {Record} from '@app-common/record/record.model';
import {ViewMode} from '@app-common/views/view.model';
import {AppData} from '@store/view/view.store';
import {Metadata} from '@store/metadata/metadata.store.service';

export interface RecordViewModel {
    data: RecordViewData;
    appData: AppData;
    metadata: Metadata;
}

export interface RecordViewData {
    module?: string;
    recordID?: string;
    mode?: ViewMode;
    record: Record;
    loading: boolean;
}

export interface RecordViewState {
    module: string;
    recordID: string;
    loading: boolean;
    widgets: boolean;
    mode: ViewMode;
}
