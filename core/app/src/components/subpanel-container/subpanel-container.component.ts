import {Component, Input, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {combineLatest, Observable} from 'rxjs';
import {LanguageStore, LanguageStringMap, LanguageStrings} from '@store/language/language.store';
import {SubpanelContainerConfig} from '@components/subpanel-container/subpanel-container.model';
import {SubpanelStoreMap} from '@store/supanel/subpanel.store';

interface SubpanelContainerViewModel {
    appStrings: LanguageStringMap;
    subpanels: SubpanelStoreMap;
}

@Component({
    selector: 'scrm-subpanel-container',
    templateUrl: 'subpanel-container.component.html',
})
export class SubpanelContainerComponent implements OnInit {

    @Input() config: SubpanelContainerConfig;

    isCollapsed = false;
    toggleIcon = 'arrow_down_filled';

    languages$: Observable<LanguageStrings> = this.languageStore.vm$;

    vm$: Observable<SubpanelContainerViewModel>;

    constructor(
        protected languageStore: LanguageStore,
    ) {
    }

    ngOnInit(): void {
        this.vm$ = combineLatest([this.languages$, this.config.subpanels$]).pipe(
            map(([languages, subpanels]) => ({
                appStrings: languages.appStrings || {},
                subpanels,
            }))
        );
    }

    toggleSubPanels(): void {
        this.isCollapsed = !this.isCollapsed;
        this.toggleIcon = (this.isCollapsed) ? 'arrow_up_filled' : 'arrow_down_filled';
    }

    getStatsValue(): string {
        return '26/6/18';
    }
}
