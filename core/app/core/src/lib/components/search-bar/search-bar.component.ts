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

import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {GlobalSearch} from '../../services/navigation/global-search/global-search.service';
import {LanguageStore, LanguageStrings} from '../../store/language/language.store';
import {Observable, Subject, of, Subscription} from 'rxjs';
import {map, debounceTime, distinctUntilChanged, switchMap, takeUntil, tap, filter} from 'rxjs/operators';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
    selector: 'scrm-search-bar',
    templateUrl: 'search-bar.component.html',
})
export class SearchBarComponent implements OnInit, OnDestroy, AfterViewInit {

    //searchTerm = '';

    isFocused: boolean = false;
    isSelectedResult: boolean = false;
    //#f2f2f2
    hasSearchTyped: boolean = false;

    searchForm: FormGroup;
    searchResults: any[] = [];

    protected subs: Subscription[] = [];
    languages$: Observable<LanguageStrings> = this.languageStore.vm$;

    vm$ = this.languages$.pipe(
        map(language => {
            return {
                appStrings: language.appStrings || {}
            };
        })
    );

    users = [
        {
            title: "John",
            lastName: "Doe",
            age: 25,
            birthYear: 1998,
            link: "/accounts/index?return_module=Accounts&return_action=DetailView"
        },
        {
            title: "Jane",
            lastName: "Smith",
            age: 32,
            birthYear: 1991,
            link: "/accounts/index?return_module=Accounts&return_action=DetailView"
        },
        {
            title: "Bob",
            lastName: "Johnson",
            age: 47,
            birthYear: 1976,
            link: "/accounts/index?return_module=Accounts&return_action=DetailView"
        },
        {
            title: "Emily",
            lastName: "Davis",
            age: 19,
            birthYear: 2004,
            link: "/accounts/index?return_module=Accounts&return_action=DetailView"
        },
        {
            title: "Michael",
            lastName: "Brown",
            age: 57,
            birthYear: 1966,
            link: "/accounts/index?return_module=Accounts&return_action=DetailView"
        },
        {
            title: "Sarah",
            lastName: "Wilson",
            age: 41,
            birthYear: 1982,
            link: "/accounts/index?return_module=Accounts&return_action=DetailView"
        },
        {
            title: "David",
            lastName: "Lee",
            age: 28,
            birthYear: 1995,
            link: "/accounts/index?return_module=Accounts&return_action=DetailView"
        },
        {
            title: "Karen",
            lastName: "Nguyen",
            age: 23,
            birthYear: 2000,
            link: "/accounts/index?return_module=Accounts&return_action=DetailView"
        },
        {
            title: "Daniel",
            lastName: "Garcia",
            age: 36,
            birthYear: 1987,
            link: "/accounts/index?return_module=Accounts&return_action=DetailView"
        },
        {
            title: "Linda",
            lastName: "Martinez",
            age: 63,
            birthYear: 1960,
            link: "/accounts/index?return_module=Accounts&return_action=DetailView"
        },
        {
            title: "Anthony",
            lastName: "Perez",
            age: 51,
            birthYear: 1972,
            link: "/accounts/index?return_module=Accounts&return_action=DetailView"
        },
        {
            title: "Melissa",
            lastName: "Taylor",
            age: 45,
            birthYear: 1978,
            link: "/accounts/index?return_module=Accounts&return_action=DetailView"
        },
        {
            title: "Eric",
            lastName: "Clark",
            age: 29,
            birthYear: 1994,
            link: "/accounts/index?return_module=Accounts&return_action=DetailView"
        },
        {
            title: "Rachel",
            lastName: "Anderson",
            age: 37,
            birthYear: 1986,
            link: "/accounts/index?return_module=Accounts&return_action=DetailView"
        },
        {
            title: "Kevin",
            lastName: "Wright",
            age: 50,
            birthYear: 1973,
            link: "/accounts/index?return_module=Accounts&return_action=DetailView"
        },
        {
            title: "Michelle",
            lastName: "Turner",
            age: 22,
            birthYear: 2001,
            link: "/accounts/index?return_module=Accounts&return_action=DetailView"
        },
        {
            title: "Steven",
            lastName: "Allen",
            age: 43,
            birthYear: 1980,
            link: "/accounts/index?return_module=Accounts&return_action=DetailView"
        },
        {
            title: "Amanda",
            lastName: "Gonzalez",
            age: 31,
            birthYear: 1992,
            link: "/accounts/index?return_module=Accounts&return_action=DetailView"
        },
        {
            title: "Brian",
            lastName: "Scott",
            age: 39,
            birthYear: 1984,
            link: "/accounts/index?return_module=Accounts&return_action=DetailView"
        },
        {
            title: "Jasmine",
            lastName: "Rivera",
            age: 26,
            birthYear: 1997,
            link: "/accounts/index?return_module=Accounts&return_action=DetailView"
        }
    ];


    constructor(protected globalSearch: GlobalSearch,protected languageStore: LanguageStore,) {
    }

    ngOnInit() {
        this.searchForm = new FormGroup({
            searchTerm: new FormControl('')
        });

        this.subs.push(this.searchForm.get('searchTerm').valueChanges
            .pipe(
                tap(value => {
                    if(value.length) {
                        this.hasSearchTyped = true
                    } else {
                        this.hasSearchTyped = false;
                    }
                }),
                debounceTime(300),
                distinctUntilChanged(),
                filter(searchString => searchString.length>2),
                //switchMap(term => this.searchService.search(term)),
            ).subscribe((term: string) => {
            this.searchResults = this.users.filter(user =>
                user.title.toLowerCase().includes(term.toLowerCase()) ||
                user.lastName.toLowerCase().includes(term.toLowerCase())
            )
            }));
    }

    ngAfterViewInit() {

    }

    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    getFirstDropdownItem() {


    }

    search(): void {

        this.globalSearch.navigateToSearch(this.searchForm.get('searchTerm').value).finally(() => {
            this.clearSearchTerm();
        });
    }

    clearSearchTerm(): void {
        this.searchForm.reset();
    }


    onFocus() {
        this.isFocused = true;
    }

    onBlur() {
        setTimeout(() => {
            this.isFocused = false;

        }, 200);
    }


}
