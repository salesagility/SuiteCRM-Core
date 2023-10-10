/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2023 SalesAgility Ltd.
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

import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GlobalSearch} from '../../services/navigation/global-search/global-search.service';
import {LanguageStore, LanguageStrings} from '../../store/language/language.store';
import {Observable, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map, tap} from 'rxjs/operators';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
    selector: 'scrm-search-bar',
    templateUrl: 'search-bar.component.html',
})
export class SearchBarComponent implements OnInit, OnDestroy {

    @ViewChild('searchInput') searchInput: ElementRef;

    searchWord: string = '';
    searchForm: FormGroup;
    searchResults: any[] = [];

    isFocused: boolean = false;
    hasSearchTyped: boolean = false;

    protected subs: Subscription[] = [];
    languages$: Observable<LanguageStrings> = this.languageStore.vm$;

    vm$ = this.languages$.pipe(
        map(language => {
            return {
                appStrings: language.appStrings || {}
            };
        })
    );

    constructor(protected globalSearch: GlobalSearch, protected languageStore: LanguageStore) {
    }

    ngOnInit(): void {
        this.searchForm = new FormGroup({
            searchTerm: new FormControl('')
        });

        this.subs.push(this.searchForm.get('searchTerm').valueChanges
            .pipe(
                tap(data => {
                    if (data) {
                        this.hasSearchTyped = true;
                    } else {
                        this.hasSearchTyped = false;
                    }
                }),
                distinctUntilChanged(),
                filter(searchString => searchString?.length > 1),
            ).subscribe((term: string) => this.searchWord = term));
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    search(): void {
        if (this.searchWord.length) {
            this.globalSearch.navigateToSearch(this.searchWord).finally(() => {
                this.clearSearchTerm();
                this.searchInput.nativeElement.blur();
            });
        }
    }

    clearSearchTerm(): void {
        this.searchForm.reset();
        this.hasSearchTyped = false;
        this.searchWord = '';
    }

    onFocus(): void {
        this.isFocused = true;
        const initialValue = this.searchForm?.get('searchTerm')?.value ?? '';
        if (initialValue.length > 2) {
            this.hasSearchTyped = true;
            this.searchWord = initialValue;
        }
    }

    onBlur(): void {
        setTimeout(() => {
            this.isFocused = false;
            this.hasSearchTyped = false;
        }, 200);
    }
}
