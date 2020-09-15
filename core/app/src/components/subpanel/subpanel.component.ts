import {Component, OnInit} from '@angular/core';
import {LanguageStore, LanguageStrings} from '@store/language/language.store';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
    selector: 'scrm-subpanel',
    templateUrl: 'subpanel.component.html',
})
export class SubpanelComponent implements OnInit {
    isCollapsed: boolean = false;
    toggleIcon: string = 'arrow_down_filled';
    
    languages$: Observable<LanguageStrings> = this.languageStore.vm$;
    records$:  Observable<LanguageStrings> = this.languageStore.vm$;

    vm$ = combineLatest([
        this.languages$,
        
    ]).pipe(
        map(([languages]) => (
            {
                appStrings: languages.appStrings || {},
                appListStrings: languages.appListStrings || {}
            })
        )
    );

    constructor(protected languageStore: LanguageStore) {
    }

    ngOnInit(): void {
    }

    toggleSubPanels(): void {
        this.isCollapsed = !this.isCollapsed;
        this.toggleIcon = (this.isCollapsed) ? 'arrow_up_filled' : 'arrow_down_filled';
    }
}
