import {Injectable} from '@angular/core';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {RecordViewStore} from '@views/record/store/record-view/record-view.store';
import {MetadataStore} from '@store/metadata/metadata.store.service';

@Injectable()
export class SidebarWidgetAdapter {

    config$ = combineLatest([
        this.metadata.recordViewMetadata$, this.store.showSidebarWidgets$
    ]).pipe(
        map(([metadata, show]) => {

            if (metadata.sidebarWidgets && metadata.sidebarWidgets.length) {
                metadata.sidebarWidgets.forEach(widget => {
                    if (widget && widget.refreshOnRecordUpdate) {
                        widget.reload$ = this.store.record$.pipe(map(() => true));
                    }
                });
            }

            return {
                widgets: metadata.sidebarWidgets || [],
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
