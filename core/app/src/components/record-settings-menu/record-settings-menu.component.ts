import {Component} from '@angular/core';
import {ModuleAction} from '@store/navigation/navigation.store';
import {ButtonInterface} from '@components/button/button.model';
import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {RecordViewStore} from '@store/record-view/record-view.store';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';

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

    constructor(
        protected recordStore: RecordViewStore,
        protected actionHandler: ModuleNavigation,
        protected router: Router,
        private route: ActivatedRoute,
        private moduleNameMapper: ModuleNameMapper
    ) {
    }

    get historyButton(): ButtonInterface {
        if (!this.recordStore) {
            return null;
        }

        return {
            label: this.recordStore.appStrings.LBL_HISTORY || '',
            klass: 'settings-button',
            icon: 'clock',
            onClick: (): void => {
                this.recordStore.showWidgets = !this.recordStore.showWidgets;
            }
        };
    }

    get createButton(): ButtonInterface {
        if (!this.recordStore) {
            return null;
        }
        const route = '/' + this.recordStore.vm.appData.module.name + '/edit';
        const module = this.moduleNameMapper.toLegacy(this.recordStore.vm.appData.module.name);

        return {
            label: this.recordStore.appStrings.LBL_NEW || '',
            klass: 'settings-button',
            onClick: (): void => {
                this.router.navigate([route], {
                    queryParams: {
                        // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                        return_module: module,
                        // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                        return_action: 'index',
                    }
                }).then();
            }
        };
    }

    get editButton(): ButtonInterface {
        if (!this.recordStore) {
            return null;
        }

        const route = '/' + this.recordStore.vm.appData.module.name + '/edit';
        const module = this.moduleNameMapper.toLegacy(this.recordStore.vm.appData.module.name);

        return {
            label: this.recordStore.appStrings.LBL_EDIT || '',
            klass: 'settings-button',
            onClick: (): void => {
                this.router.navigate([route], {
                    queryParams: {
                        // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                        return_module: module,
                        // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                        return_action: 'index',
                        // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                        record: this.route.snapshot.params.record
                    }
                }).then();
            }
        };
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
