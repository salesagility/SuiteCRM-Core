import {Injectable} from '@angular/core';
import {RecordActionData, RecordActionHandler} from '@views/record/actions/record.action';
import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';
import {Router} from '@angular/router';
import {ViewMode} from '@app-common/views/view.model';

@Injectable({
    providedIn: 'root'
})
export class RecordCreateAction extends RecordActionHandler {
    key = 'create';
    modes = ['detail' as ViewMode];

    constructor(protected moduleNameMapper: ModuleNameMapper, protected router: Router) {
        super();
    }

    run(data: RecordActionData): void {
        const store = data.store;
        const baseRecord = store.getBaseRecord();

        const route = '/' + store.vm.appData.module.name + '/edit';
        const module = this.moduleNameMapper.toLegacy(store.vm.appData.module.name);

        this.router.navigate([route], {
            queryParams: {
                // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                return_module: module,
                // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                return_action: 'DetailView',
                // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                return_record: (baseRecord && baseRecord.id) || ''
            }
        }).then();
    }

    shouldDisplay(): boolean {
        return true;
    }
}
