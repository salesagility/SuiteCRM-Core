import {Injectable} from '@angular/core';
import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';
import {Params, Router} from '@angular/router';
import {SubpanelActionData, SubpanelActionHandler} from '@containers/subpanel/actions/subpanel.action';
import {AttributeMap} from '@app-common/record/record.model';
import {isVoid} from '@app-common/utils/value-utils';
import get from 'lodash-es/get';


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

        const queryParams = {
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            return_module: this.moduleNameMapper.toLegacy(data.parentModule),
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            return_action: 'DetailView',
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            return_id: data.parentId || ''
        } as Params;
        this.addAdditionalFields(data, queryParams);
        this.addParams(data, queryParams);

        this.router.navigate([route], {
            queryParams
        }).then();
    }

    /**
     * Add additional record fields
     *
     * @param {object} data SubpanelActionData
     * @param {object} queryParams Params map
     */
    protected addAdditionalFields(data: SubpanelActionData, queryParams: Params): void {
        const parentAttributes = (data.store.parentRecord && data.store.parentRecord.attributes) || {} as AttributeMap;

        if (!parentAttributes && !Object.keys(parentAttributes).length) {
            return;
        }

        const additionalFields = data.action.additionalFields ?? {} as { [key: string]: string };
        const additionalFieldKeys = Object.keys(additionalFields) || [];

        additionalFieldKeys.forEach(additionalFieldKey => {
            if (!additionalFieldKey || !additionalFields[additionalFieldKey]) {
                return;
            }

            const parentAttribute = additionalFields[additionalFieldKey];
            const attribute = get(parentAttributes, parentAttribute, null);

            if (isVoid(attribute)) {
                return;
            }

            queryParams[additionalFieldKey] = attribute;
        });
    }

    /**
     * Add configuration defined params
     *
     * @param {object} data SubpanelActionData
     * @param {object} queryParams Params map
     */
    protected addParams(data: SubpanelActionData, queryParams: Params): void {

        const params = data.action.extraParams ?? {} as { [key: string]: string };
        const paramKeys = Object.keys(params) || [];

        paramKeys.forEach(paramKey => {
            if (!paramKey || !params[paramKey]) {
                return;
            }

            queryParams[paramKey] = params[paramKey];
        });
    }
}
