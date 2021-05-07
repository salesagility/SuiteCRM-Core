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
import {BehaviorSubject, combineLatest, Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {Action, ActionContext, ActionDataSource, Button, ButtonGroupInterface, ButtonInterface} from 'common';
import {SystemConfigStore} from '../../store/system-config/system-config.store';
import {
    ScreenSize,
    ScreenSizeObserverService
} from '../../services/ui/screen-size-observer/screen-size-observer.service';
import {LanguageStore, LanguageStrings} from '../../store/language/language.store';

export interface ActionGroupMenuViewModel {
    actions: Action[];
    screenSize: ScreenSize;
    languages: LanguageStrings;
}

@Component({
    selector: 'scrm-action-group-menu',
    templateUrl: './action-group-menu.component.html',
})
export class ActionGroupMenuComponent implements OnInit {

    @Input() klass = '';
    @Input() buttonClass = 'btn btn-sm';
    @Input() actionContext: ActionContext;
    @Input() config: ActionDataSource;
    configState = new BehaviorSubject<ButtonGroupInterface>({buttons: []});
    config$ = this.configState.asObservable();

    vm$: Observable<ActionGroupMenuViewModel>;

    protected buttonGroupClass = 'dropdown-button-secondary';

    protected subs: Subscription[];
    protected screen: ScreenSize = ScreenSize.Medium;
    protected defaultBreakpoint = 3;
    protected breakpoint: number;

    constructor(
        protected languages: LanguageStore,
        protected screenSize: ScreenSizeObserverService,
        protected systemConfigStore: SystemConfigStore,
    ) {
    }

    ngOnInit(): void {
        this.vm$ = combineLatest([
            this.config.getActions(),
            this.screenSize.screenSize$,
            this.languages.vm$
        ]).pipe(
            map(([actions, screenSize, languages]) => {
                if (screenSize) {
                    this.screen = screenSize;
                }
                this.configState.next(this.getButtonGroupConfig(actions));

                return {actions, screenSize, languages};
            })
        );
    }

    isXSmallScreen(): boolean {
        return this.screen === ScreenSize.XSmall;
    }

    getButtonGroupConfig(actions: Action[]): ButtonGroupInterface {

        const expanded = [];
        const collapsed = [];

        actions.forEach((action: Action) => {
            const button = this.buildButton(action);

            if (action.params && action.params.expanded) {
                expanded.push(button);
                return;
            }

            collapsed.push(button);
        });

        let breakpoint = this.getBreakpoint();
        if (expanded.length < breakpoint) {
            breakpoint = expanded.length;
        }

        const buttons = expanded.concat(collapsed);

        return {
            buttonKlass: [this.buttonClass],
            dropdownLabel: this.languages.getAppString('LBL_ACTIONS') || '',
            breakpoint,
            dropdownOptions: {
                placement: ['bottom-right'],
                wrapperKlass: [(this.buttonGroupClass)]
            },
            buttons
        } as ButtonGroupInterface;
    }

    getBreakpoint(): number {

        const breakpointMap = this.systemConfigStore.getConfigValue('recordview_actions_limits');

        if (this.screen && breakpointMap && breakpointMap[this.screen]) {
            this.breakpoint = breakpointMap[this.screen];
            return this.breakpoint;
        }

        if (this.breakpoint) {
            return this.breakpoint;
        }

        return this.defaultBreakpoint;
    }

    protected buildButton(action: Action): ButtonInterface {
        const button = {
            label: action.label || '',
            klass: this.buttonClass,
            onClick: (): void => {
                this.config.runAction(action, this.actionContext);
            }
        } as ButtonInterface;

        if (action.icon) {
            button.icon = action.icon;
        }

        if (action.status) {
            Button.appendClasses(button, [action.status]);
        }

        if (action.klass) {
            Button.appendClasses(button, action.klass);
        }

        return button;
    }
}
