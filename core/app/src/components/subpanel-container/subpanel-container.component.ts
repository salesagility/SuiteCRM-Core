import {Component, Input, OnInit} from '@angular/core';
import {map, take, tap} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {LanguageStore, LanguageStringMap, LanguageStrings} from '@store/language/language.store';
import {SubpanelContainerConfig} from '@components/subpanel-container/subpanel-container.model';
import {SubpanelStore, SubpanelStoreMap} from '@store/subpanel/subpanel.store';
import {MaxColumnsCalculator} from '@services/ui/max-columns-calculator/max-columns-calculator.service';

interface SubpanelContainerViewModel {
    appStrings: LanguageStringMap;
    subpanels: SubpanelStoreMap;
}

@Component({
    selector: 'scrm-subpanel-container',
    templateUrl: 'subpanel-container.component.html',
    providers: [MaxColumnsCalculator]
})
export class SubpanelContainerComponent implements OnInit {

    @Input() config: SubpanelContainerConfig;

    isCollapsed = false;
    toggleIcon = 'arrow_down_filled';
    maxColumns$: Observable<number>;

    languages$: Observable<LanguageStrings> = this.languageStore.vm$;

    vm$: Observable<SubpanelContainerViewModel>;

    constructor(
        protected languageStore: LanguageStore,
        protected maxColumnCalculator: MaxColumnsCalculator
    ) {
    }

    ngOnInit(): void {
        this.vm$ = combineLatest([this.languages$, this.config.subpanels$]).pipe(
            map(([languages, subpanels]) => ({
                appStrings: languages.appStrings || {},
                subpanels,
            })),
            tap(({subpanels}) => {
                if (subpanels) {
                    Object.keys(subpanels).forEach(subpanelKey => {
                        const subpanel = subpanels[subpanelKey];
                        subpanel.loadStatistics().pipe(take(1)).subscribe();
                    });
                }
            })
        );

        this.maxColumns$ = this.getMaxColumns();
    }

    getMaxColumns(): Observable<number> {
        return this.maxColumnCalculator.getMaxColumns(this.config.recordStore.widgets$);
    }

    toggleSubPanels(): void {
        this.isCollapsed = !this.isCollapsed;
        this.toggleIcon = (this.isCollapsed) ? 'arrow_up_filled' : 'arrow_down_filled';
    }

    showSubpanel(item: SubpanelStore): void {
        item.show = !item.show;
        if (item.show) {
            item.load().pipe(take(1)).subscribe();
        }
    }
}
