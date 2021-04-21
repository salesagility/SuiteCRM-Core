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

export declare type ButtonCallback = (...args) => void;

export interface ButtonInterface {
    klass?: string | string[] | Set<string> | { [key: string]: any };
    onClick?: ButtonCallback;
    label?: string;
    labelKey?: string;
    titleKey?: string;
    icon?: string;
    iconKlass?: string;
}

export class Button implements ButtonInterface {

    constructor(
        public klass: string | string[] | Set<string> | { [key: string]: any } = null,
        public onClick: ButtonCallback = null,
        public label: string = null,
        public icon: string = null,
        public labelKey: string = null,
        public titleKey: string = null
    ) {
    }

    public static fromButton(button: ButtonInterface): Button {
        return new Button(
            button.klass,
            button.onClick,
            button.label,
            button.icon,
            button.labelKey,
            button.titleKey
        );
    }

    public static appendClasses(button: ButtonInterface, newClasses: string[]): void {

        if (!button.klass) {
            button.klass = newClasses;
            return;
        }

        if (typeof button.klass === 'string') {
            button.klass = newClasses.join(' ') + ' ' + button.klass;
            return;
        }

        if (button.klass instanceof Array || button.klass instanceof Set) {
            button.klass = [
                ...button.klass,
                ...newClasses
            ];

            return;
        }

        if (button.klass instanceof Object) {
            const classes = {
                ...button.klass,
            };

            classes[newClasses.join(' ')] = true;
            button.klass = classes;
        }
    }

    public addClasses(newClasses: string[]): void {

        if (!this.klass) {
            this.klass = newClasses;
            return;
        }

        if (typeof this.klass === 'string') {
            this.klass = newClasses.join(' ') + ' ' + this.klass;
            return;
        }

        if (this.klass instanceof Array || this.klass instanceof Set) {
            this.klass = [
                ...this.klass,
                ...newClasses
            ];

            return;
        }

        if (this.klass instanceof Object) {
            const classes = {
                ...this.klass,
            };

            classes[newClasses.join(' ')] = true;
            this.klass = classes;
        }
    }
}
