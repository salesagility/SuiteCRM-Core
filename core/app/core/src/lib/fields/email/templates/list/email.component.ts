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

import {Component, OnInit} from '@angular/core';
import {BaseFieldComponent} from '../../../base/base-field.component';
import {DataTypeFormatter} from '../../../../services/formatters/data-type.formatter.service';
import {FieldLogicManager} from '../../../field-logic/field-logic.manager';
import {UserPreferenceStore} from '../../../../store/user-preference/user-preference.store';
import {ModuleNavigation} from "../../../../services/navigation/module-navigation/module-navigation.service";
import {ModuleNameMapper} from "../../../../services/navigation/module-name-mapper/module-name-mapper.service";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AppStateStore} from "../../../../store/app-state/app-state.store";
import {ActionNameMapper} from "../../../../services/navigation/action-name-mapper/action-name-mapper.service";

@Component({
    selector: 'scrm-email-list',
    templateUrl: './email.component.html',
    styleUrls: []
})
export class EmailListFieldsComponent extends BaseFieldComponent implements OnInit {
    linkType: string;

    constructor(
        protected typeFormatter: DataTypeFormatter,
        protected logic: FieldLogicManager,
        protected preferences: UserPreferenceStore,
        protected navigation: ModuleNavigation,
        protected moduleNameMapper: ModuleNameMapper,
        protected actionNameMapper: ActionNameMapper,
        protected appState: AppStateStore,
        protected modalService: NgbModal,
        protected router: Router
    ) {
        super(typeFormatter, logic);
    }

    ngOnInit(): void {
        this.linkType = this.preferences.getUserPreference('email_link_type') || 'mailto';
    }

    openEmail() {

        const view = this.actionNameMapper.toLegacy(this.appState.getView());
        const module = this.moduleNameMapper.toLegacy(this.parent.module);
        const parent_id = this.parent.id;
        const parent_name = this.parent.attributes.name;
        const email = this.field.value;

        let return_id;
        if (view !== 'ListView' && view !== 'index') {
            return_id = parent_id;
        }

        this.router.navigate(['emails', 'compose'], {
            queryParams: {
                return_module: module,
                return_action: view,
                return_id,
                to_addrs_names: email,
                parent_type: module,
                parent_name,
                parent_id,
            }
        })
    }
}
