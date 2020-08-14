import {Component} from '@angular/core';
import {ModuleAction} from '@store/navigation/navigation.store';
import {ButtonInterface} from '@components/button/button.model';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {RecordViewStore} from '@store/record-view/record-view.store';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
    selector: 'scrm-record-settings-menu',
    templateUrl: 'record-settings-menu.component.html',
})
export class RecordSettingsMenuComponent {

    vm$ = combineLatest([
        this.recordStore.records$
    ]).pipe(
        map((
            [
                records
            ]
        ) => ({
            records
        }))
    );

    constructor(protected recordStore: RecordViewStore, protected actionHandler: ModuleNavigation) {
    }

    get actions(): ModuleAction[] {
        if (!this.recordStore.vm.appData.module.menu) {
            return [];
        }

        return this.recordStore.vm.appData.module.menu.filter(action => (
            action.name === 'Create'
        ));
    }

    public getButtonConfig(action: ModuleAction): ButtonInterface {

        if (!this.recordStore.vm.appData.appState.module) {
            return {};
        }

        if (!this.recordStore.vm.appData.language) {
            return {};
        }

        const module = this.recordStore.vm.appData.appState.module;
        const language = this.recordStore.vm.appData.language;
        let labelKey = '';
        if (action.actionLabelKey) {
            labelKey = action.actionLabelKey;
        }

        return {
            klass: 'settings-button',
            label: this.actionHandler.getActionLabel(module, action, language, labelKey),
            onClick: (): void => {
                this.actionHandler.navigate(action).then();
            }
        };
    }
}
