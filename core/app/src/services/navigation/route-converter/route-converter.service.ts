import {Injectable} from '@angular/core';
import {ActivatedRoute, DefaultUrlSerializer, Params, UrlTree} from '@angular/router';
import {HttpParams} from '@angular/common/http';
import {ModuleNameMapper} from '@services/navigation/module-name-mapper/module-name-mapper.service';
import {ActionNameMapper} from '@services/navigation/action-name-mapper/action-name-mapper.service';

const ROUTE_PREFIX = './#';

export interface RouteInfo {
    module?: string;
    action?: string;
    record?: string;
    params?: Params;
}

@Injectable({providedIn: 'root'})
export class RouteConverter {

    constructor(
        private moduleNameMapper: ModuleNameMapper,
        private actionNameMapper: ActionNameMapper
    ) {
    }

    /**
     * Public Api
     */

    /**
     * Converts legacyLink to front end link. Includes the /#/.
     *
     * @param {string} legacyLink legacy url
     * @returns {string} frontend path
     */
    public toFrontEndLink(legacyLink: string): string {
        return ROUTE_PREFIX + this.toFrontEndRoute(legacyLink);
    }

    /**
     * Converts legacyLink to front end route
     *
     * @param {string} legacyLink legacy url
     * @returns {string} frontend path
     */
    public toFrontEndRoute(legacyLink: string): string {

        if (legacyLink && legacyLink.includes('/#/')) {
            const anchorParts = legacyLink.split('/#/');

            if (anchorParts.length < 2) {
                return '/';
            }

            return anchorParts[1];
        }

        const info = this.parse(legacyLink);
        if (!info) {
            return '/';
        }

        let route = this.buildRoute(info.module, info.action, info.record);

        route += this.buildQueryString(info.params, ['module', 'action', 'record']);

        return route;
    }

    /**
     * Build legacy link from router information
     *
     * @param {object} params route params
     * @param {object} queryParams route query params
     * @returns {string} legacy url
     */
    public toLegacy(params: Params, queryParams: Params): string {
        let path = './legacy/index.php';

        const queryObject = {
            ...queryParams,
        };

        if (params.module) {
            queryObject.module = this.moduleNameMapper.toLegacy(params.module);
        }
        if (params.action) {
            queryObject.action = this.actionNameMapper.toLegacy(params.action);
        }

        if (params.record) {
            queryObject.record = params.record;
        }

        path += this.buildQueryString(queryObject);

        return path;
    }

    /**
     * Parse legacy link
     *
     * @param {string} legacyLink to parse
     * @returns {object} route info
     */
    public parse(legacyLink: string): RouteInfo {

        const parser = new DefaultUrlSerializer();

        const replacedString = legacyLink.replace('/legacy', '');
        const parts = replacedString.split('?');

        if (parts.length < 2) {
            return null;
        }

        const tree: UrlTree = parser.parse('/?' + parts[1]);

        const params = tree.queryParamMap;

        const module = params.get('module') || '';
        const action = params.get('action') || '';
        const record = params.get('record') || '';

        return {
            module,
            action,
            record,
            params: tree.queryParams
        };
    }

    /**
     * Check if given routeInfo matches the provided activated route
     *
     * @param {object} route to check
     * @param {object} routeInfo to check
     * @returns {boolean} is match
     */
    public matchesActiveRoute(route: ActivatedRoute, routeInfo: RouteInfo): boolean {
        const toCheck = [
            {
                name: 'module',
                map: (value): any => {

                    if (!value) {
                        return value;
                    }

                    return this.mapModuleToFrontend(value);
                }
            },
            {
                name: 'action',
                map: (value): any => {

                    if (!value) {
                        return value;
                    }

                    return this.mapActionToFrontEnd(value);
                }
            },
            {
                name: 'record',
                map: (value): any => value
            }
        ];

        let match = true;

        toCheck.forEach((param) => {
            if (!route.snapshot.params[param.name] && !routeInfo[param.name]) {
                return;
            }

            match = match && (route.snapshot.params[param.name] === param.map(routeInfo[param.name]));
        });

        return match;
    }

    /**
     * Internal API
     */

    /**
     * Build front end route
     *
     * @param {string} module name
     * @param {string} action name
     * @param {string} record id
     * @returns {string} route
     */
    protected buildRoute(module: string, action: string, record: string): string {
        const moduleName = this.mapModuleToFrontend(module);
        let route = `${moduleName}`;

        if (action) {
            const actionName = this.mapActionToFrontEnd(action);
            route += `/${actionName}`;
        }

        if (record) {
            route += `/${record}`;
        }

        return route;
    }

    /**
     * Build query string
     *
     * @param {object} queryParams query parameters
     * @param {string[]} exclude paramenters to exclude
     * @returns {string} query string
     */
    protected buildQueryString(queryParams: Params, exclude: string[] = []): string {

        let params = new HttpParams();


        Object.keys(queryParams).forEach((param) => {

            if (exclude.includes(param)) {
                return;
            }

            const value = queryParams[param];
            params = params.set(param, value);
        });

        if (params.keys().length > 0) {
            return '?' + params.toString();
        }

        return '';
    }

    /**
     * Map legacy module name to frontend
     *
     * @param {string} module legacy name
     * @returns {string} frontend name
     */
    protected mapModuleToFrontend(module: string): string {
        return this.moduleNameMapper.toFrontend(module);
    }

    /**
     * Map legacy action name to frontend
     *
     * @param {string} action legacy name
     * @returns {string} frontend name
     */
    protected mapActionToFrontEnd(action: string): string {
        return this.actionNameMapper.toFrontend(action);
    }
}
