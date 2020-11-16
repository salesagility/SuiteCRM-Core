import {Component} from '@angular/core';
import {BehaviorSubject, combineLatest, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {RecordActionsAdapter} from '@views/record/adapters/actions.adapter';
import {ButtonGroupInterface} from '@components/button-group/button-group.model';
import {Action} from '@app-common/actions/action.model';
import {ScreenSize, ScreenSizeObserverService} from '@services/ui/screen-size-observer/screen-size-observer.service';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {LanguageStore} from '@store/language/language.store';
import {ButtonInterface} from '@components/button/button.model';

@Component({
    selector: 'scrm-record-settings-menu',
    templateUrl: 'record-settings-menu.component.html',
})
export class RecordSettingsMenuComponent {

    configState = new BehaviorSubject<ButtonGroupInterface>({buttons: []});
    config$ = this.configState.asObservable();

    vm$ = combineLatest([
        this.actionsDataSource.getActions(),
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

    protected buttonClass = 'settings-button';
    protected buttonGroupClass = 'dropdown-button-secondary';

    protected subs: Subscription[];
    protected screen: ScreenSize = ScreenSize.Medium;
    protected defaultBreakpoint = 3;
    protected breakpoint: number;

    constructor(
        protected languages: LanguageStore,
        protected actionsDataSource: RecordActionsAdapter,
        protected screenSize: ScreenSizeObserverService,
        protected systemConfigStore: SystemConfigStore
    ) {
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
                this.actionsDataSource.runAction(action);
            }
        } as ButtonInterface;

        if (action.icon) {
            button.icon = action.icon;
        }

        return button;
    }
}
