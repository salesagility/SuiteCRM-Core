import {Component, Input, OnInit} from '@angular/core';
import {RecordViewStore} from '@store/record-view/record-view.store';
import {MetadataStore, RecordViewMetadata} from '@store/metadata/metadata.store.service';
import {combineLatest, Observable} from 'rxjs';
import {LanguageStore, LanguageStrings} from '@store/language/language.store';
import {map} from 'rxjs/operators';
import {RecordContentAdapter} from '@store/record-view/adapters/record-content.adapter';
import {RecordContentDataSource} from '@components/record-content/record-content.model';

@Component({
    selector: 'scrm-record-container',
    templateUrl: 'record-container.component.html',
    providers: [RecordContentAdapter]
})
export class RecordContainerComponent implements OnInit {
    @Input() module;
    type = '';
    widgetTitle = '';

    language$: Observable<LanguageStrings> = this.language.vm$;
    recordMeta$: Observable<RecordViewMetadata> = this.metadata.recordViewMetadata$;

    vm$ = combineLatest([
        this.language$, this.recordMeta$,
    ]).pipe(
        map((
            [language, recordMeta]
        ) => ({
            language,
            recordMeta,
        }))
    );

    constructor(
        public recordViewStore: RecordViewStore,
        protected language: LanguageStore,
        protected metadata: MetadataStore,
        protected contentAdapter: RecordContentAdapter
    ) {
    }

    getDisplayWidgets(): boolean {
        const display = this.recordViewStore.showWidgets;
        if (display) {
            this.type = 'history';
            this.widgetTitle = 'LBL_QUICK_HISTORY';
        }
        return display;
    }

    ngOnInit(): void {
    }

    getContentAdapter(): RecordContentDataSource {
        return this.contentAdapter;
    }
}
