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
import {By} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {SearchCriteria, SearchMetaFieldMap} from 'common';
import {map} from 'rxjs/operators';
import {DropdownButtonModule} from '../dropdown-button/dropdown-button.module';
import {ButtonModule} from '../button/button.module';
import {CloseButtonModule} from '../close-button/close-button.module';
import {Metadata, MetadataStore} from '../../store/metadata/metadata.store.service';
import {PanelModule} from '../panel/panel.module';
import {LanguageStore} from '../../store/language/language.store';
import {metadataStoreMock} from '../../store/metadata/metadata.store.spec.mock';
import {FieldGridModule} from '../field-grid/field-grid.module';
import {ListViewStore} from '../../views/list/store/list-view/list-view.store';
import {ListFilterComponent} from './list-filter.component';
import {languageStoreMock} from '../../store/language/language.store.spec.mock';
import {FilterConfig} from './list-filter.model';
import {ListFilterModule} from './list-filter.module';
import {listviewStoreMock} from '../../views/list/store/list-view/list-view.store.spec.mock';

describe('ListFilterComponent', () => {
    let testHostComponent: ListFilterComponent;
    let testHostFixture: ComponentFixture<ListFilterComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                ListFilterComponent,
            ],
            imports: [
                CloseButtonModule,
                ButtonModule,
                PanelModule,
                DropdownButtonModule,
                FieldGridModule,
                RouterTestingModule,
                ApolloTestingModule,
                NoopAnimationsModule,
                ListFilterModule
            ],
            providers: [
                {provide: ListViewStore, useValue: listviewStoreMock},
                {provide: MetadataStore, useValue: metadataStoreMock},
                {provide: LanguageStore, useValue: languageStoreMock},
            ],
        }).compileComponents();

        testHostFixture = TestBed.createComponent(ListFilterComponent);
        testHostComponent = testHostFixture.componentInstance;

        testHostComponent.config = {

            module: listviewStoreMock.getModuleName(),
            criteria$: listviewStoreMock.criteria$,
            searchFields$: listviewStoreMock.metadata$.pipe(
                map((meta: Metadata) => {

                    if (!meta || !meta.search) {
                        return {} as SearchMetaFieldMap;
                    }

                    const searchMeta = meta.search;

                    let type = 'advanced';
                    if (!searchMeta.layout.advanced) {
                        type = 'basic';
                    }

                    return searchMeta.layout[type];
                })
            ),

            onClose: (): void => {
                listviewStoreMock.showFilters = false;
            },

            onSearch: (): void => {
                listviewStoreMock.showFilters = false;
            },

            updateSearchCriteria: (criteria: SearchCriteria, reload = true): void => {
                listviewStoreMock.updateSearchCriteria(criteria, reload);
            }
        } as FilterConfig;

        testHostFixture.detectChanges();
    }));

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should have header', () => {
        expect(testHostFixture.debugElement.query(By.css('.card-header')).nativeElement).toBeTruthy();
    });

    it('should have body', () => {
        expect(testHostFixture.debugElement.query(By.css('.card-body')).nativeElement).toBeTruthy();
    });

    it('should have header title', () => {

        const element = testHostFixture.debugElement.query(By.css('.card-header'));

        expect(element.nativeElement.textContent).toContain('Basic Filter');
    });

    it('should have close icon', () => {

        expect(testHostComponent).toBeTruthy();
        const element = testHostFixture.debugElement.query(By.css('.card-header'));
        const button = element.nativeElement.querySelector('button');

        expect(button).toBeTruthy();
    });

    it('should have configurable buttons', () => {

        expect(testHostComponent).toBeTruthy();
        expect(testHostFixture.debugElement.query(By.css('.saved-filters-button')).nativeElement).toBeTruthy();
        expect(testHostFixture.debugElement.query(By.css('.quick-filter-button')).nativeElement).toBeTruthy();
    });

    it('should have grid list', () => {

        expect(testHostComponent).toBeTruthy();
        expect(testHostFixture.debugElement.query(By.css('scrm-field-grid')).nativeElement).toBeTruthy();
        expect(testHostFixture.debugElement.query(By.css('form')).nativeElement).toBeTruthy();
        expect(testHostFixture.debugElement.query(By.css('.clear-filters-button')).nativeElement).toBeTruthy();
        expect(testHostFixture.debugElement.query(By.css('.filter-button')).nativeElement).toBeTruthy();
    });

    it('should allow to insert filter value', waitForAsync(() => {

        expect(testHostFixture.debugElement.query(By.css('scrm-field-grid')).nativeElement).toBeTruthy();

        const input = testHostFixture.debugElement.query(By.css('input')).nativeElement;
        input.value = 'test';
        input.dispatchEvent(new Event('input'));

        expect(input).toBeTruthy();

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {

            expect(testHostComponent.searchCriteria.filters.name).toBeTruthy();
            expect(testHostComponent.searchCriteria.filters.name.operator).toEqual('=');
            expect(testHostComponent.searchCriteria.filters.name.values).toEqual(['test']);
        });
    }));

    it('should allow to applyFilter', waitForAsync(() => {

        expect(testHostFixture.debugElement.query(By.css('scrm-field-grid')).nativeElement).toBeTruthy();

        const input = testHostFixture.debugElement.query(By.css('input')).nativeElement;
        const filterButton = testHostFixture.debugElement.query(By.css('.filter-button')).nativeElement;

        input.value = 'test';
        input.dispatchEvent(new Event('input'));

        expect(input).toBeTruthy();

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {

            filterButton.click();

            testHostFixture.detectChanges();
            testHostFixture.whenStable().then(() => {
                expect(testHostComponent.searchCriteria.filters.name).toBeTruthy();
                expect(testHostComponent.searchCriteria.filters.name.operator).toEqual('=');
                expect(testHostComponent.searchCriteria.filters.name.values).toEqual(['test']);

                expect(listviewStoreMock.showFilters).toEqual(false);
                expect(listviewStoreMock.recordList.criteria.filters.name.operator).toEqual('=');
                expect(listviewStoreMock.recordList.criteria.filters.name.values).toEqual(['test']);
            });
        });
    }));

    it('should allow to clear filter', waitForAsync(() => {

        expect(testHostFixture.debugElement.query(By.css('scrm-field-grid')).nativeElement).toBeTruthy();

        const input = testHostFixture.debugElement.query(By.css('input')).nativeElement;
        const filterButton = testHostFixture.debugElement.query(By.css('.filter-button')).nativeElement;
        const clearButton = testHostFixture.debugElement.query(By.css('.clear-filters-button')).nativeElement;

        input.value = 'test';
        input.dispatchEvent(new Event('input'));

        expect(input).toBeTruthy();

        testHostFixture.detectChanges();
        testHostFixture.whenStable().then(() => {

            filterButton.click();
            clearButton.click();

            testHostFixture.detectChanges();
            testHostFixture.whenStable().then(() => {

                expect(testHostComponent.searchCriteria).toBeTruthy();
                expect(testHostComponent.searchCriteria.filters.name.operator).toEqual('');
                expect(testHostComponent.searchCriteria.filters.name.values).toEqual([]);

                expect(listviewStoreMock.recordList.criteria).toEqual({filters: {}});
            });
        });
    }));
});
