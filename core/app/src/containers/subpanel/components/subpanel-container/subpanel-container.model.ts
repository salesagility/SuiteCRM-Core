import {Observable} from 'rxjs';
import {SubpanelStoreMap} from '@containers/subpanel/store/subpanel/subpanel.store';

export interface SubpanelContainerConfig {
    subpanels$: Observable<SubpanelStoreMap>;
    sidebarActive$: Observable<boolean>;
}
