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

import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Button, ButtonInterface} from '../../common/components/button/button.model';

export type MinimiseButtonStatus = 'minimised' | 'maximised';

@Component({
    selector: 'scrm-minimise-button',
    templateUrl: './minimise-button.component.html',
    styleUrls: []
})
export class MinimiseButtonComponent implements OnInit, OnChanges {
    @Input() config: ButtonInterface;
    @Input() status: MinimiseButtonStatus = 'maximised';
    internalConfig: ButtonInterface;

    buttonClasses = ['minimise-button'];

    constructor() {
    }

    ngOnInit(): void {
        this.buildButton();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.config) {
            this.buildButton();
        }
    }

    buildButton(): void {
        const btn = Button.fromButton(this.config);
        btn.addClasses(this.buttonClasses);
        btn.icon = this.getIcon();
        btn.onClick = (): void => {
            this.config.onClick();
            this.toggleStatus();
        };
        this.internalConfig = btn;
    }

    toggleStatus(): void {
        let newStatus: MinimiseButtonStatus = 'minimised';
        if (this.status === 'minimised') {
            newStatus = 'maximised';
        }
        this.status = newStatus;
        this.buildButton();
    }

    getIcon(): string {
        if (this.status === 'minimised') {
            return 'plus_thin';
        }
        return 'minimise';
    }
}
