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

import {Component, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {Action, ActionContext, ActionDataSource} from '../../common/actions/action.model';
import {Button, ButtonInterface} from '../../common/components/button/button.model';
import {ButtonGroupInterface} from '../../common/components/button/button-group.model';
import {isFalse} from '../../common/utils/value-utils';
import {BehaviorSubject, combineLatestWith, Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
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
    @Input() buttonGroupClass = '';
    @Input() actionContext: ActionContext;
    @Input() config: ActionDataSource;
    @Input() actionLimitConfig: string = 'recordview_actions_limits';
    configState = new BehaviorSubject<ButtonGroupInterface>({buttons: []});
    config$ = this.configState.asObservable();

    vm$: Observable<ActionGroupMenuViewModel>;

    inlineConfirmationEnabled: WritableSignal<boolean> =  signal(false);
    confirmationLabel = '';
    confirmationDynamicLabel = '';
    inlineCancelButton: ButtonInterface = null;
    inlineConfirmButton: ButtonInterface = null;
    loading: WritableSignal<boolean> = signal(false);

    protected buttonGroupDropdownClass = 'dropdown-button-secondary';

    protected subs: Subscription[];
    protected screen: ScreenSize = ScreenSize.Medium;
    protected defaultBreakpoint = 4;
    protected breakpoint: number;

    constructor(
        protected languages: LanguageStore,
        protected screenSize: ScreenSizeObserverService,
        protected systemConfigStore: SystemConfigStore,
    ) {
    }

    ngOnInit(): void {
        this.vm$ = this.config?.getActions().pipe(
            combineLatestWith(
                this.screenSize.screenSize$,
                this.languages.vm$
            ),
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

            if (action.params && action.params.collapsedMobile && this.isXSmallScreen()) {
                collapsed.push(button);
                return;
            }

            if (action.params && action.params.expanded) {
                expanded.push(button);
                return;
            }

            collapsed.push(button);
        });

        const collapseButtons = this.config.collapseButtons ?? true;

        let breakpoint = actions.length;
        if (collapseButtons === true) {
            breakpoint = this.getBreakpoint();
            if (expanded.length < breakpoint) {
                breakpoint = expanded.length;
            }
        }

        const buttons = expanded.concat(collapsed);

        return {
            buttonKlass: [this.buttonClass],
            dropdownLabel: this.languages.getAppString('LBL_ACTIONS') || '',
            breakpoint,
            dropdownOptions: {
                placement: ['bottom-right'],
                wrapperKlass: [(this.buttonGroupDropdownClass)]
            },
            buttons
        } as ButtonGroupInterface;
    }

    getBreakpoint(): number {

        const breakpointMap = this.systemConfigStore.getConfigValue(this.actionLimitConfig);

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
            labelModule: this?.actionContext?.module ?? '',
            labelKey: action.labelKey || '',
            klass: this.buttonClass,
            titleKey: action.titleKey || '',
            onClick: (): void => {

                const inlineConfirmation = action?.params?.inlineConfirmation ?? false;
                if (inlineConfirmation) {
                    this.triggerTemporaryLoading();
                    const callback = (): void => {
                        this.config.runAction(action, this.actionContext);
                    }
                    this.initInlineConfirmation(action, callback);

                    return;
                }

                this.config.runAction(action, this.actionContext);
            }
        } as ButtonInterface;

        if (!button.label){
            button.labelKey = action.labelKey ?? '';
        }

        const debounceClick = action?.params?.debounceClick ?? null;

        button.debounceClick = true;

        if (isFalse(debounceClick)) {
            button.debounceClick = false;
        }

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

    protected triggerTemporaryLoading() {
        this.loading.set(true);
        const delay = parseInt(this.systemConfigStore.getUi('inline_confirmation_loading_delay')) ?? 200;
        setTimeout(() => {
            this.loading.set(false);
        }, delay);
    }

    protected initInlineConfirmation(action: Action, callback: () => void): void {
        const cancelConfig = action?.params?.inlineConfirmationButtons?.cancel ?? {};
        const confirmConfig = action?.params?.inlineConfirmationButtons?.confirm ?? {};
        this.confirmationLabel = action?.params?.confirmationLabel ?? '';
        this.confirmationDynamicLabel = action?.params?.confirmationDynamicLabel ?? '';

        this.inlineCancelButton = this.buildInlineCancelButton(cancelConfig)
        this.inlineConfirmButton = this.buildInlineConfirmButton(confirmConfig, callback)
        this.inlineConfirmationEnabled.set(true);
    }

    protected buildInlineCancelButton(config: ButtonInterface): ButtonInterface {
        const defaults = {
            labelKey: 'LBL_NO',
            klass: 'btn btn-sm p-0 m-0 btn-link border-0 line-height-initial',
            debounceClick: true,
        } as ButtonInterface;
        const button = {...defaults, ...(config ?? {})};

        button.onClick = (): void => {
            this.triggerTemporaryLoading();
            this.resetInlineConfirmation();
        }

        return button;
    }

    protected buildInlineConfirmButton(config: ButtonInterface, callback: Function): ButtonInterface {
        const defaults = {
            labelKey: 'LBL_YES',
            klass: 'btn btn-sm p-0 m-0 btn-link border-0 line-height-initial',
            debounceClick: true,
        } as ButtonInterface;
        const button = {...defaults, ...(config ?? {})};

        button.onClick = (): void => {
            this.triggerTemporaryLoading();
            callback();
            this.resetInlineConfirmation();
        }

        return button;
    }

    protected resetInlineConfirmation(): void {
        this.inlineConfirmationEnabled.set(false);
        this.confirmationDynamicLabel = '';
        this.confirmationLabel = '';
        this.inlineConfirmButton = null;
        this.inlineCancelButton = null;
    }
}
