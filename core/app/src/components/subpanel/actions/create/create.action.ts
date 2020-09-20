import {Injectable} from '@angular/core';
import {ActionData, ActionHandler} from '@app-common/actions/action.model';
import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';
import {Router} from '@angular/router';


@Injectable({
    providedIn: 'root'
})
export class SubPanelCreateAction extends ActionHandler {
    key = 'create';

    constructor(
        protected moduleNameMapper: ModuleNameMapper,
        protected router: Router
    ) {
        super();
    }

    run(data: ActionData): void {
        const store = data.store;

        const moduleName = this.moduleNameMapper.toFrontend(data.subpanelMeta.module);

        const route = `/${moduleName}/edit`;

        this.router.navigate([route], {
            queryParams: {
                // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                return_module: data.subpanelMeta.module,
                // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                return_action: 'DetailView',
                // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                return_record: (store.getRecord() && store.getRecord().id) || ''
            }
        }).then();
    }
}
