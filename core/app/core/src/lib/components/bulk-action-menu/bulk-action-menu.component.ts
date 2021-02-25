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

import {Component, Input, OnInit} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {BulkActionsMap, DropdownButtonInterface, SelectionDataSource, SelectionStatus} from 'common';
import {LanguageStore, LanguageStringMap} from '../../store/language/language.store';

export interface BulkActionDataSource {
    getBulkActions(): Observable<BulkActionsMap>;

    executeBulkAction(action: string): void;
}

export interface BulkActionViewModel {
    appStrings: LanguageStringMap;
    status: SelectionStatus;
    count: number;
    actions: BulkActionsMap;
}

@Component({
    selector: 'scrm-bulk-action-menu',
    templateUrl: 'bulk-action-menu.component.html'
})
export class BulkActionMenuComponent implements OnInit {

    @Input() selectionSource: SelectionDataSource;
    @Input() actionSource: BulkActionDataSource;

    appStrings$: Observable<LanguageStringMap> = this.languageStore.appStrings$;

    vm$: Observable<BulkActionViewModel> = null;

    constructor(protected languageStore: LanguageStore) {
    }

    ngOnInit(): void {
        const status$ = this.selectionSource.getSelectionStatus();
        const count$ = this.selectionSource.getSelectedCount();
        const actions$ = this.actionSource.getBulkActions();
        this.vm$ = combineLatest([this.appStrings$, status$, count$, actions$]).pipe(
            map(([appStrings, status, count, actions]) => ({appStrings, status, count, actions}))
        );
    }

    checked(status: SelectionStatus): boolean {
        return status === SelectionStatus.ALL;
    }

    intermediate(status: SelectionStatus): boolean {
        return status === SelectionStatus.SOME || status === SelectionStatus.PAGE;
    }

    selectPage(): void {
        this.selectionSource.updateSelection(SelectionStatus.PAGE);
    }

    selectAll(): void {
        this.selectionSource.updateSelection(SelectionStatus.ALL);
    }

    deselectAll(): void {
        this.selectionSource.updateSelection(SelectionStatus.NONE);
    }

    toggleSelection(status: SelectionStatus): void {
        if (status === SelectionStatus.ALL) {
            this.selectionSource.updateSelection(SelectionStatus.NONE);
            return;
        }

        this.selectionSource.updateSelection(SelectionStatus.ALL);
    }

    getDropdownConfig(actions: BulkActionsMap, appStrings: LanguageStringMap): DropdownButtonInterface {
        const label = appStrings && appStrings.LBL_BULK_ACTION_BUTTON_LABEL || '';
        const dropdownConfig = {
            label,
            klass: ['bulk-action-button', 'btn', 'btn-sm'],
            wrapperKlass: ['bulk-action-group', 'float-left'],
            items: []
        } as DropdownButtonInterface;

        Object.keys(actions).forEach(actionKey => {
            const action = actions[actionKey];
            dropdownConfig.items.push({
                label: appStrings && appStrings[action.labelKey] || '',
                klass: [`${actionKey}-bulk-action`],
                onClick: (): void => {
                    this.actionSource.executeBulkAction(action.key);
                }
            });
        });

        return dropdownConfig;
    }
}
