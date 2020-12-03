import {Injectable} from '@angular/core';
import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';
import {Router} from '@angular/router';
import {SubpanelActionData, SubpanelActionHandler} from '@containers/subpanel/actions/subpanel.action';


@Injectable({
    providedIn: 'root'
})
export class SubpanelCreateAction extends SubpanelActionHandler {
    key = 'create';

    constructor(
        protected moduleNameMapper: ModuleNameMapper,
        protected router: Router
    ) {
        super();
    }

    run(data: SubpanelActionData): void {

        const moduleName = data.module;

        const route = `/${moduleName}/edit`;

        this.router.navigate([route], {
            queryParams: {
                // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                return_module: this.moduleNameMapper.toLegacy(data.parentModule),
                // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                return_action: 'DetailView',
                // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                return_id: data.parentId || ''
            }
        }).then();
    }
}
