import {Component} from '@angular/core';
import {ModuleAction} from '@store/navigation/navigation.store';
import {ButtonInterface} from '@components/button/button.model';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {ListViewStore} from '@store/list-view/list-view.store';

@Component({
    selector: 'scrm-action-menu',
    templateUrl: 'action-menu.component.html',
})
export class ActionMenuComponent {

    constructor(protected listStore: ListViewStore, protected actionHandler: ModuleNavigation) {
    }

    get actions(): ModuleAction[] {
        if (!this.listStore.vm.appData.module.menu) {
            return [];
        }

        return this.listStore.vm.appData.module.menu;
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

        return {
            klass: 'action-button',
            label: this.actionHandler.getActionLabel(module, action, language),
            onClick: (): void => {
                this.actionHandler.navigate(action).then();
            }
        };
    }
}
