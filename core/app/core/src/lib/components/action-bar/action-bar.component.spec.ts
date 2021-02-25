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

import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ActionBarUiComponent} from './action-bar.component';
import {of} from 'rxjs';
import {take} from 'rxjs/operators';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {GlobalSearch} from '../../services/navigation/global-search/global-search.service';
import {languageStoreMock} from '../../store/language/language.store.spec.mock';
import {themeImagesMockData} from '../../store/theme-images/theme-images.store.spec.mock';
import {LanguageStore} from '../../store/language/language.store';
import {ThemeImagesStore} from '../../store/theme-images/theme-images.store';


describe('ActionBarUiComponent', () => {
    let component: ActionBarUiComponent;
    let fixture: ComponentFixture<ActionBarUiComponent>;

    let navigateCounter = 0;
    let lastSearchTerm = '';

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, HttpClientTestingModule, FormsModule],
            providers: [
                {
                    provide: ThemeImagesStore, useValue: {
                        images$: of(themeImagesMockData).pipe(take(1))
                    }
                },
                {
                    provide: LanguageStore, useValue: {
                        vm$: of(languageStoreMock).pipe(take(1))
                    }
                },
                {
                    provide: GlobalSearch, useValue: {
                        navigateToSearch: (searchTerm: string): Promise<boolean> => {
                            navigateCounter++;
                            lastSearchTerm = searchTerm;
                            return of(true).toPromise();
                        }
                    }
                },
            ],
            declarations: [ActionBarUiComponent]
        })
            .compileComponents();
    }));

    beforeEach(waitForAsync(() => {
        fixture = TestBed.createComponent(ActionBarUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));


    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have global search', () => {

        const input = fixture.debugElement.query(By.css('.global-search .global-search-term')).nativeElement;
        const button = fixture.debugElement.query(By.css('.global-search .search-button')).nativeElement;

        expect(input).toBeTruthy();
        expect(button).toBeTruthy();
    });

    it('should navigate to global search on click', waitForAsync(() => {

        const global = fixture.nativeElement.getElementsByClassName('global-search')[0];
        const input = global.querySelector('input');
        const button = global.querySelector('button');

        navigateCounter = 0;
        lastSearchTerm = '';

        expect(input).toBeTruthy();
        expect(input.className).toContain('global-search-term');
        expect(button).toBeTruthy();
        expect(button.className).toContain('search-button');

        const term = 'search query term';
        input.value = term;

        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        fixture.whenStable().then(() => {

            button.click();
            fixture.detectChanges();

            expect(navigateCounter).toEqual(1);
            expect(lastSearchTerm).toEqual(term);
        });
    }));
});
