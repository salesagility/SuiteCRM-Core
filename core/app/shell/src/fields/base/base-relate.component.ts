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

import {LanguageStore} from 'core';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {DataTypeFormatter} from 'core';
import {catchError, map, tap} from 'rxjs/operators';
import {AttributeMap, Record} from 'common';
import {RelateService} from 'core';
import {BaseFieldComponent} from '@fields/base/base-field.component';
import {ModuleNameMapper} from 'core';

@Component({template: ''})
export class BaseRelateComponent extends BaseFieldComponent implements OnInit, OnDestroy {
    selectedValues: AttributeMap[] = [];

    status: '' | 'searching' | 'not-found' | 'error' | 'found' = '';

    constructor(
        protected languages: LanguageStore,
        protected typeFormatter: DataTypeFormatter,
        protected relateService: RelateService,
        protected moduleNameMapper: ModuleNameMapper
    ) {
        super(typeFormatter);
    }

    get module(): string {
        if (!this.record || !this.record.module) {
            return null;
        }

        return this.record.module;
    }

    ngOnInit(): void {
        this.initValue();

        if (this.relateService) {
            this.relateService.init(this.getRelatedModule());
        }
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    search = (text: string): Observable<any> => {

        this.status = 'searching';

        return this.relateService.search(text, this.getRelateFieldName()).pipe(
            tap(() => this.status = 'found'),
            catchError(() => {
                this.status = 'error';
                return of([]);
            }),
            map(records => {
                if (!records || records.length < 1) {
                    this.status = 'not-found';
                    return [];
                }

                const flatRecords: AttributeMap[] = [];

                records.forEach((record: Record) => {
                    if (record && record.attributes) {
                        flatRecords.push(record.attributes);
                    }
                });

                this.status = '';

                return flatRecords;
            }),
        );
    };

    getRelateFieldName(): string {
        return (this.field && this.field.definition && this.field.definition.rname) || 'name';
    }

    getRelatedModule(): string {
        const legacyName = (this.field && this.field.definition && this.field.definition.module) || '';
        if (!legacyName) {
            return '';
        }

        return this.moduleNameMapper.toFrontend(legacyName);
    }

    getMessage(): string {
        const messages = {
            searching: 'LBL_SEARCHING',
            'not-found': 'LBL_NOT_FOUND',
            error: 'LBL_SEARCH_ERROR',
            found: 'LBL_FOUND',
            'no-module': 'LBL_FOUND'
        };

        if (messages[this.status]) {
            return messages[this.status];
        }

        return '';
    }

    getInvalidClass(): string {
        if (this.field.formControl && this.field.formControl.invalid && this.field.formControl.touched) {
            return 'is-invalid';
        }

        if (this.hasSearchError()) {
            return 'is-invalid';
        }

        return '';
    }

    hasSearchError(): boolean {
        return this.status === 'error' || this.status === 'not-found';
    }

    resetStatus(): void {
        this.status = '';
    }

    getPlaceholderLabel(): string {
        return this.languages.getAppString('LBL_TYPE_TO_SEARCH') || '';
    }

    protected buildRelate(id: string, relateValue: string): any {
        const relate = {id};

        if (this.getRelateFieldName()) {
            relate[this.getRelateFieldName()] = relateValue;
        }

        return relate;
    }


    protected initValue(): void {
        if (!this.field.valueObject) {
            return;
        }

        if (!this.field.valueObject.id) {
            return;
        }

        this.selectedValues = [];
        this.selectedValues.push(this.field.valueObject);
    }
}
