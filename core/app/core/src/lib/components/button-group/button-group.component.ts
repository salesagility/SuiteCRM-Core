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

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Button, ButtonInterface} from 'common';
import {DropdownButtonInterface} from 'common';
import {ButtonGroupInterface} from 'common';
import {Observable, Subscription} from 'rxjs';

interface SplitButtons {
    expanded: ButtonInterface[];
    collapsed: ButtonInterface[];
}

@Component({
    selector: 'scrm-button-group',
    templateUrl: './button-group.component.html',
    styles: [],
})
export class ButtonGroupComponent implements OnInit, OnDestroy {

    @Input() config$: Observable<ButtonGroupInterface>;

    buttons: SplitButtons = {
        expanded: [],
        collapsed: [],
    };

    dropdownConfig: DropdownButtonInterface;

    protected internalConfig: ButtonGroupInterface;
    private sub: Subscription;

    constructor() {
    }

    ngOnInit(): void {
        this.sub = this.config$.subscribe(config => {
            this.internalConfig = {...config};
            this.splitButtons();
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    isDropdown(item: ButtonInterface): boolean {
        if (!item) {
            return false;
        }
        return 'items' in item;
    }

    buildDropdownConfig(): void {

        let buttonClasses = ['button-group-button'];

        if (this.internalConfig.buttonKlass && this.internalConfig.buttonKlass.length > 0) {
            buttonClasses = buttonClasses.concat(this.internalConfig.buttonKlass);
        }

        let wrapperClasses = ['button-group-dropdown'];

        const dropdownOptions = this.internalConfig.dropdownOptions;
        const optionsWrapperKlass = dropdownOptions && dropdownOptions.wrapperKlass;

        if (optionsWrapperKlass && optionsWrapperKlass.length > 0) {
            wrapperClasses = wrapperClasses.concat(optionsWrapperKlass);
        }

        this.dropdownConfig = {
            label: this.internalConfig.dropdownLabel,
            klass: [...buttonClasses],
            wrapperKlass: wrapperClasses,
            items: this.buttons.collapsed,
        } as DropdownButtonInterface;

        if (this.internalConfig.dropdownOptions && this.internalConfig.dropdownOptions.placement) {
            this.dropdownConfig.placement = this.internalConfig.dropdownOptions.placement;
        }
    }

    protected getBreakpoint(): number {

        if (!this.internalConfig.breakpoint) {
            return 4;
        }

        return this.internalConfig.breakpoint;
    }

    protected splitButtons(): void {

        this.buttons.expanded = [];
        this.buttons.collapsed = [];

        if (!this.internalConfig.buttons || this.internalConfig.buttons.length < 1) {
            return;
        }

        let count = 0;

        this.internalConfig.buttons.forEach(button => {

            if (!button) {
                return;
            }

            if (count < this.getBreakpoint()) {
                let classes = ['button-group-button'];
                if (this.internalConfig.buttonKlass && this.internalConfig.buttonKlass.length > 0) {
                    classes = classes.concat(this.internalConfig.buttonKlass);
                }
                const newButton = {...button};
                Button.appendClasses(newButton, [...classes]);

                this.buttons.expanded.push(newButton);
            } else {
                this.buttons.collapsed.push({...button});
            }

            count++;
        });

        this.buildDropdownConfig();
    }

}
