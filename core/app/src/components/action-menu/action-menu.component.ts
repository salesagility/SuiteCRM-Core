import {Component, OnInit} from '@angular/core';
import {ModuleAction} from '@store/navigation/navigation.store';
import {ButtonInterface} from '@components/button/button.model';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {ListViewStore} from '@store/list-view/list-view.store';
import {ButtonGroupInterface} from '@components/button-group/button-group.model';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {ScreenSize, ScreenSizeObserverService} from '@services/ui/screen-size-observer/screen-size-observer.service';
import {SystemConfigStore} from '@store/system-config/system-config.store';

@Component({
    selector: 'scrm-action-menu',
    templateUrl: 'action-menu.component.html',
})
export class ActionMenuComponent implements OnInit {

    configState = new BehaviorSubject<ButtonGroupInterface>({buttons: []});
    config$ = this.configState.asObservable();

    vm$ = combineLatest([
        this.screenSize.screenSize$
    ]).pipe(
        map(([screenSize]) => {
            if (screenSize) {
                this.screen = screenSize;
            }
            this.configState.next(this.getButtonGroupConfig());
            return {screenSize};
        })
    );

    protected screen: ScreenSize = ScreenSize.Medium;
    protected defaultBreakpoint = 3;
    protected breakpoint: number;


    constructor(
        protected listStore: ListViewStore,
        protected actionHandler: ModuleNavigation,
        protected screenSize: ScreenSizeObserverService,
        protected systemConfigs: SystemConfigStore
    ) {
    }

    ngOnInit(): void {
        this.configState.next(this.getButtonGroupConfig());
    }

    getButtonGroupConfig(): ButtonGroupInterface {
        const actions = this.actions;
        const config = {
            buttonKlass: ['action-button'],
            dropdownLabel: this.listStore.appStrings.LBL_MORE || '',
            buttons: [],
            dropdownOptions: {
                placement: ['bottom-right']
            },
            breakpoint: this.getBreakpoint()
        } as ButtonGroupInterface;

        actions.forEach(action => {
            const buttonConfig = this.getButtonConfig(action);
            if (buttonConfig && buttonConfig.klass) {
                config.buttons.push(buttonConfig);
            }
        });

        return config;
    }

    getBreakpoint(): number {

        const breakpointMap = this.systemConfigs && this.systemConfigs.getConfigValue('listview_actions_limits');

        if (this.screen && breakpointMap && breakpointMap[this.screen]) {
            this.breakpoint = breakpointMap[this.screen];
            return this.breakpoint;
        }

        if (this.breakpoint) {
            return this.breakpoint;
        }

        return this.defaultBreakpoint;
    }

    get actions(): ModuleAction[] {
        if (!this.listStore.vm.appData.module || !this.listStore.vm.appData.module.menu) {
            return [];
        }

        return this.listStore.vm.appData.module.menu.filter(action => !(action.name === 'List' || action.name === 'View'));
    }

    public getButtonConfig(action: ModuleAction): ButtonInterface {

        if (!this.listStore.vm.appData.appState.module) {
            return {};
        }

        if (!this.listStore.vm.appData.language) {
            return {};
        }

        const module = this.listStore.vm.appData.appState.module;
        const language = this.listStore.vm.appData.language;
        let labelKey = '';
        if (action.actionLabelKey) {
            labelKey = action.actionLabelKey;
        }

        return {
            klass: 'action-button',
            label: this.actionHandler.getActionLabel(module, action, language, labelKey),
            onClick: (): void => {
                this.actionHandler.navigate(action).then();
            }
        };
    }
}
