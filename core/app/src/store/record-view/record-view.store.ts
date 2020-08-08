import {Injectable} from '@angular/core';
import {AppData, ViewStore} from '@store/view/view.store';
import {Metadata} from '@store/metadata/metadata.store.service';
import {Observable} from 'rxjs';

export interface RecordViewModel {
    appData: AppData;
    metadata: Metadata;
}

@Injectable()
export class RecordViewStore extends ViewStore {
    vm$: Observable<RecordViewModel>;
    vm: RecordViewModel;

    get showWidgets(): boolean {
        return true;
    }

    clear(): void {
    }

    /**
     * Clean destroy
     */
    public destroy(): void {
        this.clear();
    }
}
