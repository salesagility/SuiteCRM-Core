import {Injectable} from '@angular/core';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {MetadataStore} from '@store/metadata/metadata.store.service';
import {ListViewStore} from '@views/list/store/list-view/list-view.store';

@Injectable()
export class ListViewSidebarWidgetAdapter {

    config$ = combineLatest([
        this.metadata.listMetadata$, this.store.showSidebarWidgets$, this.store.widgets$
    ]).pipe(
        map(([metadata, show, widgetsEnabled]) => {

            if (metadata.sidebarWidgets && metadata.sidebarWidgets.length) {
                metadata.sidebarWidgets.forEach(widget => {
                    if (widget && widget.refreshOnRecordUpdate) {
                        widget.reload$ = this.store.criteria$.pipe(map(() => true));
                    }
                });
            }

            return {
                widgets: metadata.sidebarWidgets || [],
                show,
                widgetsEnabled,
            };
        })
    );

    constructor(
        protected store: ListViewStore,
        protected metadata: MetadataStore
    ) {
    }

}
