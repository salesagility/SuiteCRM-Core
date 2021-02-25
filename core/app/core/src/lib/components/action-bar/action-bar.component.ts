/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {Component} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ActionBarModel} from './action-bar-model';
import {LanguageStore, LanguageStrings} from '../../store/language/language.store';
import {GlobalSearch} from '../../services/navigation/global-search/global-search.service';

@Component({
    selector: 'scrm-action-bar-ui',
    templateUrl: './action-bar.component.html',
    styleUrls: []
})
export class ActionBarUiComponent {

    searchTerm = '';
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

    constructor(protected languageStore: LanguageStore, protected globalSearch: GlobalSearch) {
    }

    search(): void {
        this.globalSearch.navigateToSearch(this.searchTerm).finally(() => {
            this.clearSearchTerm();
        });
    }

    clearSearchTerm(): void {
        this.searchTerm = '';
    }
}
