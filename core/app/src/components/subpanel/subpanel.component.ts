import {Component, OnInit} from '@angular/core';
import {LanguageStore, LanguageStrings} from '@store/language/language.store';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {SubPanelMeta, MetadataStore} from '@store/metadata/metadata.store.service';
import { RecordViewData, RecordViewModel, RecordViewStore } from '@base/store/record-view/record-view.store';

@Component({
    selector: 'scrm-subpanel',
    templateUrl: 'subpanel.component.html',
})
export class SubpanelComponent implements OnInit {
    subpanelEntities: any = [];
    module = '';
    languages: LanguageStrings;
    buttons: any = [];

    isCollapsed = false;
    toggleIcon = 'arrow_down_filled';

    languages$: Observable<LanguageStrings> = this.languageStore.vm$;
    records$:  Observable<LanguageStrings> = this.languageStore.vm$;
    subPanelMeta$: Observable<SubPanelMeta> = this.metadata.subPanelMetadata$;
    recordStore$: Observable<RecordViewModel> = this.recordStore.vm$;

    vm$ = combineLatest([
        this.languages$,
        this.subPanelMeta$,
        this.recordStore$
    ]).pipe(
        map(([
            languages,
            subPanelMeta,
            recordStore
        ]) => {

            this.module = recordStore.data.record.module;
            this.languages = languages;

            const returnObj = {
                appStrings: languages.appStrings || {},
                appListStrings: languages.appListStrings || {},
                modStrings: languages.modStrings || {},
                subPanelMeta,
                recordStore,
                module: recordStore.data.record.module,
                showPanel: false
            };

            this.subpanelEntities.push(returnObj);

            return returnObj;
        })
    );

    constructor(
        protected languageStore: LanguageStore,
        protected metadata: MetadataStore,
        protected recordStore: RecordViewStore
    ) {
    }

    ngOnInit(): void {
    }

    toggleSubPanels(): void {
        this.isCollapsed = !this.isCollapsed;
        this.toggleIcon = (this.isCollapsed) ? 'arrow_up_filled' : 'arrow_down_filled';
    }

    getModuleLabel(labelKey: string): string {
        const label: string = this.languageStore.getFieldLabel(labelKey, this.module, this.languages);

        return label;
    }

    getStatsValue(): string {
        return '26/6/18';
    }
}
