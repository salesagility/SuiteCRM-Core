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

import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RecordThreadItemConfig} from './record-thread-item.model';
import {of, Subscription} from 'rxjs';
import {FieldFlexbox, RecordFlexboxConfig} from '../../../../components/record-flexbox/record-flexbox.model';
import {shareReplay} from 'rxjs/operators';
import {ButtonInterface} from 'common';

@Component({
    selector: 'scrm-record-thread-item',
    templateUrl: './record-thread-item.component.html',
    styleUrls: [],
})
export class RecordThreadItemComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() config: RecordThreadItemConfig;
    @ViewChild('body') bodyEl: ElementRef;
    collapsed = false;
    collapsible = false;
    collapseLimit = 300;
    dynamicClass = '';
    protected subs: Subscription[] = [];

    ngOnInit(): void {
        this.initDynamicClass();
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    ngAfterViewInit() {
        if (!this.config || !this.config.collapsible) {
            return;
        }

        const collapseLimit = this.config.collapseLimit || this.collapseLimit;

        let height = this.bodyEl.nativeElement.offsetHeight;

        if (height > collapseLimit) {
            this.collapsible = true;
            this.collapsed = true;
        }
    }

    /**
     *
     * Build layout data source according to received configuration
     * @param {object} layout: FieldFlexboxRow[]
     * @returns {object} RecordFlexboxConfig
     */
    buildConfig(layout: FieldFlexbox): RecordFlexboxConfig {
        return {
            record$: this.config.store.stagingRecord$,
            mode$: this.config.store.mode$,
            layout$: of(layout).pipe(shareReplay(1)),
            inputClass: {
                ...(this.config.inputClass || {}),
                'form-control form-control-sm': true
            },
            buttonClass: this.config.buttonClass || '',
            labelClass: this.config.labelClass || {},
            rowClass: this.config.rowClass || {},
            colClass: this.config.colClass || {},
        } as RecordFlexboxConfig;
    }

    getCollapseButton(): ButtonInterface {
        return {
            klass: 'collapse-button btn btn-link btn-sm',
            labelKey: this.collapsed ? 'LBL_SHOW_MORE' : 'LBL_SHOW_LESS',
            onClick: () => {
                this.collapsed = !this.collapsed;
                if (this.collapsed) {
                    this.config && this.config.collapsed()
                } else {
                    this.config && this.config.expanded();
                }
            }
        } as ButtonInterface;
    }

    protected initDynamicClass(): void {
        if (!this.config || !this.config.dynamicClass || !this.config.dynamicClass.length) {
            return;
        }

        this.subs.push(this.config.store.stagingRecord$.subscribe(record => {
            const klasses = [];

            if (!record || !record.fields || !Object.keys(record.fields).length) {
                return;
            }

            this.config.dynamicClass.forEach(fieldKey => {
                if (!fieldKey) {
                    return;
                }

                if (!record.fields[fieldKey] && !record.attributes[fieldKey]) {
                    return;
                }

                const prefix = fieldKey + '-';
                let values = [];

                if (!record.fields[fieldKey]) {

                    if (Array.isArray(record.attributes[fieldKey])) {

                        values = values.concat(record.attributes[fieldKey]);

                    } else if (typeof record.attributes[fieldKey] !== 'object') {

                        values.push(record.attributes[fieldKey]);
                    }

                } else {

                    if (record.fields[fieldKey].value) {
                        values.push(record.fields[fieldKey].value);
                    }

                    if (record.fields[fieldKey].valueList && record.fields[fieldKey].valueList.length) {
                        values = values.concat(record.fields[fieldKey].valueList);
                    }
                }

                if (!values || !values.length) {
                    return;
                }

                const klass = prefix + values.join(' ' + prefix);
                klasses.push(klass);
            });

            this.dynamicClass = klasses.join(' ');

        }))
    }
}
