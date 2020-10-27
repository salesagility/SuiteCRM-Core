import {RecordViewStore} from '@views/record/store/record-view/record-view.store';
import {combineLatest, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {MetadataStore, RecordViewMetadata} from '@store/metadata/metadata.store.service';
import {map} from 'rxjs/operators';
import {LanguageStore} from '@store/language/language.store';
import {Panel, PanelRow} from '@app-common/metadata/metadata.model';
import {RecordContentConfig, RecordContentDataSource} from '@components/record-content/record-content.model';
import {Record} from '@app-common/record/record.model';
import {RecordActionManager} from '@views/record/actions/record-action-manager.service';
import {RecordActionData} from '@views/record/actions/record.action';

@Injectable()
export class RecordContentAdapter implements RecordContentDataSource {
    inlineEdit: true;

    constructor(
        protected store: RecordViewStore,
        protected metadata: MetadataStore,
        protected language: LanguageStore,
        protected actions: RecordActionManager
    ) {
    }

    getEditAction(): void {
        const data: RecordActionData = {
            store: this.store
        };

        this.actions.run('edit', this.store.getMode(), data);
    }

    getDisplayConfig(): Observable<RecordContentConfig> {

        return combineLatest(
            [this.metadata.recordViewMetadata$, this.store.mode$]
        ).pipe(
            map(([meta, mode]) => {
                const layout = this.getLayout(meta);
                const maxColumns = meta.templateMeta.maxColumns || 2;
                const tabDefs = meta.templateMeta.tabDefs;

                return {
                    layout,
                    mode,
                    maxColumns,
                    tabDefs
                } as RecordContentConfig;
            })
        );
    }

    getPanels(): Observable<Panel[]> {
        return combineLatest(
            [this.metadata.recordViewMetadata$, this.store.stagingRecord$, this.language.vm$]
        ).pipe(
            map(([meta, record, languages]) => {

                const panels = [];
                const module = (record && record.module) || '';

                meta.panels.forEach(panelDefinition => {
                    const label = this.language.getFieldLabel(panelDefinition.key.toUpperCase(), module, languages);
                    const panel = {label, key: panelDefinition.key, rows: []} as Panel;

                    panelDefinition.rows.forEach(rowDefinition => {
                        const row = {cols: []} as PanelRow;
                        rowDefinition.cols.forEach(cellDefinition => {
                            row.cols.push({...cellDefinition});
                        });
                        panel.rows.push(row);
                    });

                    panels.push(panel);
                });

                return panels;
            })
        );
    }

    getRecord(): Observable<Record> {
        return this.store.stagingRecord$;
    }

    protected getLayout(recordMeta: RecordViewMetadata): string {
        let layout = 'panels';
        if (recordMeta.templateMeta.useTabs) {
            layout = 'tabs';
        }

        return layout;
    }
}
