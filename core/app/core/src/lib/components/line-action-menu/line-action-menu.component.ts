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
import {LineAction, Record} from 'common';
import {LanguageStore} from '../../store/language/language.store';
import {SubpanelActionManager} from "../../containers/subpanel/components/subpanel/action-manager.service";
import {SubpanelActionData} from "../../containers/subpanel/actions/subpanel.action";
import {SubpanelStore} from "../../containers/subpanel/store/subpanel/subpanel.store";

@Component({
    selector: 'scrm-line-action-menu',
    templateUrl: 'line-action-menu.component.html'
})

export class LineActionMenuComponent implements OnInit {

    @Input() lineActions: LineAction[];
    @Input() record: Record;
    @Input() store: SubpanelStore;

    items: LineAction[];

    constructor(protected languageStore: LanguageStore,
                protected actionManager: SubpanelActionManager
    ) {
    }

    ngOnInit(): void {
        this.setLineActions();
    }

    setLineActions(): void {
        const actions = [];

        this.lineActions.forEach(action => {
            const recordAction = {...action};

            const routing = action.routing ?? '';

            recordAction.label = this.languageStore.getAppString(recordAction.labelKey);

            if (routing !== false) {

                const params: { [key: string]: any } = {};
                /* eslint-disable camelcase,@typescript-eslint/camelcase*/
                params.return_module = action.legacyModuleName;
                params.return_action = action.returnAction;
                params.return_id = this.record.id;
                /* eslint-enable camelcase,@typescript-eslint/camelcase */
                params[action.mapping.moduleName] = action.legacyModuleName;

                params[action.mapping.name] = this.record.attributes.name;
                params[action.mapping.id] = this.record.id;

                recordAction.link = {
                    label: recordAction.label,
                    url: null,
                    route: '/' + action.module + '/' + action.action,
                    params
                };
            }

            actions.push(recordAction);
        });
        this.items = actions.reverse();
    }

    runAction(actionKey: string) {

        const subpanelActionData = {
            subpanelMeta: this.store.metadata,
            module: this.record.module || this.store.metadata.module,
            id: this.record.id,
            parentModule: this.store.parentModule,
            parentId: this.store.parentId,
            store: this.store
        } as SubpanelActionData;

        this.actionManager.run(actionKey, subpanelActionData);
    }

}
