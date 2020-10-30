import {Injectable} from '@angular/core';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {RecordViewStore} from '@views/record/store/record-view/record-view.store';
import {MetadataStore} from '@store/metadata/metadata.store.service';

@Injectable()
export class TopWidgetAdapter {

    config$ = combineLatest([
        this.metadata.recordViewMetadata$, this.store.showTopWidget$
    ]).pipe(
        map(([metadata, show]) => {

            if (metadata.topWidget && metadata.topWidget.refreshOnRecordUpdate) {
                metadata.topWidget.reload$ = this.store.record$.pipe(map(() => true));
            }

            return {
                metadata,
                show
            };
        })
    );

    constructor(
        protected store: RecordViewStore,
        protected metadata: MetadataStore
    ) {
    }

}
