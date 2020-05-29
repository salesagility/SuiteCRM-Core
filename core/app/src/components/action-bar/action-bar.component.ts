import {Component} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {LanguageStore, LanguageStrings} from '@store/language/language.store';
import {ActionBarModel} from './action-bar-model';

@Component({
    selector: 'scrm-action-bar-ui',
    templateUrl: './action-bar.component.html',
    styleUrls: []
})
export class ActionBarUiComponent {

    actionBar: ActionBarModel = {
        createLinks: [
            {
                label: 'Accounts',
                route: '/accounts/edit'
            },
            {
                label: 'Contacts',
                route: '/contacts/edit'
            },
            {
                label: 'Leads',
                route: '/leads/edit'
            },
            {
                label: 'Opportunities',
                route: '/opportunities/edit'
            },
            {
                label: 'AOS_Quotes',
                route: '/quotes/edit'
            },
            {
                label: 'AOS_Contracts',
                route: '/contracts/edit'
            },
        ],
        favoriteRecords: [],
    };

    languages$: Observable<LanguageStrings> = this.languageStore.vm$;

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
}
