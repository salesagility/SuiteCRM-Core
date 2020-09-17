import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {ViewMode} from '@base/app-common/views/view.model';
import {TabDefinitions} from '@store/metadata/metadata.store.service';
import {Panel} from '@app-common/metadata/metadata.model';

export interface RecordContentDataSource {
    getDisplayConfig(): Observable<RecordContentConfig>;

    getPanels(): Observable<Panel[]>;
}

export interface RecordContentConfig {
    layout: 'tabs' | 'panels';
    mode: ViewMode;
    maxColumns: number;
    tabDefs: TabDefinitions;
}

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
    private configSub: Subscription;
    private panelsSub: Subscription;

    constructor() {
    }

    ngOnInit(): void {
        this.configSub = this.dataSource.getDisplayConfig().subscribe(config => {
            this.config = {...config};
        });
        this.panelsSub = this.dataSource.getPanels().subscribe(panels => {
            this.panels = [...panels];
        });
    }

    ngOnDestroy(): void {
        this.configSub.unsubscribe();
        this.panelsSub.unsubscribe();
    }
}
