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
import {Action, AnyButtonInterface, ButtonGroupInterface, ButtonInterface} from 'common';
import {Observable, of} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {TableConfig} from '../../../../components/table/table.model';
import {SubpanelTableAdapter} from '../../adapters/table.adapter';
import {LanguageStore} from '../../../../store/language/language.store';
import {SubpanelStore} from '../../store/subpanel/subpanel.store';
import {SubpanelActionManager} from './action-manager.service';
import {SubpanelTableAdapterFactory} from '../../adapters/table.adapter.factory';

@Component({
    selector: 'scrm-subpanel',
    templateUrl: 'subpanel.component.html',
    providers: [
        SubpanelTableAdapter
    ]
})
export class SubpanelComponent implements OnInit {
    @Input() store: SubpanelStore;
    @Input() maxColumns$: Observable<number>;

    closeButton: ButtonInterface;
    adapter: SubpanelTableAdapter;
    config$: Observable<ButtonGroupInterface>;
    tableConfig: TableConfig;

    constructor(
        protected actionManager: SubpanelActionManager,
        protected languages: LanguageStore,
        protected tableAdapterFactory: SubpanelTableAdapterFactory
    ) {
    }

    ngOnInit(): void {
        this.adapter = this.tableAdapterFactory.create(this.store);
        this.tableConfig = this.adapter.getTable();
        if (this.maxColumns$) {
            this.tableConfig.maxColumns$ = this.maxColumns$;
        }

        this.config$ = of(this.getButtonGroupConfig(this.buildAction())).pipe(shareReplay(1));

        this.closeButton = {
            onClick: (): void => {
                this.store.show = false;
            }
        } as ButtonInterface;
    }

    buildAction(): any {
        const actions = [];

        if (this.store.metadata) {
            if (this.store.metadata.top_buttons) {
                this.store.metadata.top_buttons.forEach(button => {
                    const label = this.languages.getFieldLabel(
                        button.labelKey,
                        button.module
                    );

                    actions.push({
                        ...button,
                        label,
                        params: {
                            module: button.module
                        }
                    });
                });
            }
        }

        return actions;
    }

    getButtonGroupConfig(actions: Action[]): ButtonGroupInterface {
        const buttons = [];

        actions.forEach((action: Action) => {
            buttons.push(this.buildButton(action));
        });

        let breakpoint = 1;
        if (buttons && buttons.length > 1) {
            breakpoint = -1;
        }

        const dropdownLabel = this.languages.getAppString('LBL_ACTIONS');

        return {
            buttons,
            breakpoint,
            dropdownLabel,
            buttonKlass: ['btn', 'btn-sm', 'btn-outline-light']
        } as ButtonGroupInterface;
    }

    protected buildButton(action: Action): AnyButtonInterface {
        return {
            label: action.label || '',
            klass: 'btn btn-sm btn-outline-light',
            onClick: (): void => {
                this.actionManager.run(action.key, {
                    subpanelMeta: this.store.metadata,
                    module: action.params.module || this.store.metadata.module,
                    parentModule: this.store.parentModule,
                    parentId: this.store.parentId,
                    store: this.store,
                    action
                });
            }
        } as AnyButtonInterface;
    }
}
