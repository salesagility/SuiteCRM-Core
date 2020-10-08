import {Observable} from 'rxjs';
import {SubpanelStoreMap} from '@store/subpanel/subpanel.store';
import {RecordViewStore} from '@store/record-view/record-view.store';

export interface SubpanelContainerConfig {
    subpanels$: Observable<SubpanelStoreMap>;
    recordStore: RecordViewStore;
}
