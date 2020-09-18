import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from 'rxjs';
import {Panel} from '@app-common/metadata/metadata.model';
import {LanguageStore} from '@store/language/language.store';
import {FieldMap} from '@app-common/record/field.model';
import {Record} from '@app-common/record/record.model';
import {RecordContentConfig, RecordContentDataSource} from '@components/record-content/record-content.model';
import {FieldLayoutConfig, FieldLayoutDataSource} from '@components/field-layout/field-layout.model';
import {map, shareReplay} from 'rxjs/operators';

@Component({
    selector: 'scrm-record-content',
    templateUrl: './record-content.component.html',
    styles: [],
})
export class RecordContentComponent implements OnInit, OnDestroy {

    @Input() dataSource: RecordContentDataSource;

    config: RecordContentConfig = {} as RecordContentConfig;
    panels: Panel[];
    active = 1;
    protected record: Record;
    protected fields: FieldMap;
    private subs: Subscription[] = [];

    constructor(protected language: LanguageStore) {
    }

    ngOnInit(): void {
        this.subs.push(this.dataSource.getDisplayConfig().subscribe(config => {
            this.config = {...config};
        }));
        this.subs.push(this.dataSource.getPanels().subscribe(panels => {
            this.panels = [...panels];
        }));
        this.subs.push(this.dataSource.getRecord().subscribe(record => {
            this.record = {...record};
            this.fields = record.fields;
        }));
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    getLayoutDataSource(panel: Panel): FieldLayoutDataSource {
        return {
            getConfig: (): Observable<FieldLayoutConfig> => this.dataSource.getDisplayConfig().pipe(map(config => ({
                mode: config.mode,
                maxColumns: config.maxColumns,
            }))),
            getLayout: (): Observable<Panel> => of(panel).pipe(shareReplay(1)),
            getFields: (): Observable<FieldMap> => this.dataSource.getRecord().pipe(map(record => (record.fields))),
            getRecord: (): Observable<Record> => this.dataSource.getRecord()
        } as FieldLayoutDataSource;
    }
}
