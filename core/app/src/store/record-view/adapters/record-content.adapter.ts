import {RecordViewStore} from '@store/record-view/record-view.store';
import {
    RecordContentConfig,
    RecordContentDataSource
} from '@components/record-content/record-content.component';
import {combineLatest, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {MetadataStore, RecordViewMetadata} from '@store/metadata/metadata.store.service';
import {map} from 'rxjs/operators';
import {LanguageStore} from '@store/language/language.store';
import {Panel, PanelRow} from '@app-common/metadata/metadata.model';

@Injectable()
export class RecordContentAdapter implements RecordContentDataSource {

    constructor(
        protected store: RecordViewStore,
        protected metadata: MetadataStore,
        protected language: LanguageStore
    ) {
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
            [this.metadata.recordViewMetadata$, this.store.record$, this.language.vm$]
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

    protected getLayout(recordMeta: RecordViewMetadata): string {
        let layout = 'panels';
        if (recordMeta.templateMeta.useTabs) {
            layout = 'tabs';
        }

        return layout;
    }

}
