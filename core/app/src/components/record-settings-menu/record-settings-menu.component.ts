import {Component} from '@angular/core';
import {ButtonInterface} from '@components/button/button.model';
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

        return {
            label: this.recordStore.appStrings.LBL_NEW || '',
            klass: 'settings-button',
            onClick: (): void => {

                const route = '/' + this.recordStore.vm.appData.module.name + '/edit';
                const module = this.moduleNameMapper.toLegacy(this.recordStore.vm.appData.module.name);

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

        return {
            label: this.recordStore.appStrings.LBL_EDIT || '',
            klass: 'settings-button',
            onClick: (): void => {

                const route = '/' + this.recordStore.vm.appData.module.name + '/edit';
                const module = this.moduleNameMapper.toLegacy(this.recordStore.vm.appData.module.name);

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
}
