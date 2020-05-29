import {ModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service';
import {mockModuleNavigation} from '@services/navigation/module-navigation/module-navigation.service.spec.mock';
import {Navigation} from '@store/navigation/navigation.store';

describe('Module Navigation Service', () => {
    const service: ModuleNavigation = mockModuleNavigation;

    beforeEach(() => {
    });

    it('#getModuleRoute', () => {

        const route = service.getModuleRoute({
            name: 'accounts',
            defaultRoute: './#/accounts',
            labelKey: 'Accounts',
            path: null,
            menu: [],
        });

        expect(route.url).toEqual(null);
        expect(route.route).toEqual('/accounts');
        expect(route.params).toEqual(null);
    });

    it('#getModuleLabel', () => {

        const label = service.getModuleLabel(
            {
                name: 'accounts',
                defaultRoute: './#/accounts',
                labelKey: 'Accounts',
                path: null,
                menu: [],
            }, {
                moduleList: {
                    Accounts: 'Accounts Label'
                }
            });

        expect(label).toEqual('Accounts Label');
    });

    it('#getModuleInfo', () => {

        const moduleInfo = service.getModuleInfo(
            'accounts',
            {
                tabs: [],
                groupedTabs: [],
                userActionMenu: [],
                maxTabs: 0,
                modules: {
                    accounts: {
                        name: 'accounts',
                        defaultRoute: './#/accounts',
                        labelKey: 'Accounts',
                        path: null,
                        menu: [],
                    }
                }
            } as Navigation
        );

        expect(moduleInfo).toBeTruthy();
        expect(moduleInfo.name).toEqual('accounts');
        expect(moduleInfo.defaultRoute).toEqual('./#/accounts');
        expect(moduleInfo.labelKey).toEqual('Accounts');
        expect(moduleInfo.path).toEqual(null);
        expect(moduleInfo.menu).toEqual([]);
    });

    it('#getActionRoute', () => {

        const route = service.getActionRoute({
            name: 'list',
            url: './#/accounts/list',
            labelKey: 'LBL_LIST',
            params: null,
            icon: ''
        });

        expect(route.url).toEqual(null);
        expect(route.route).toEqual('/accounts/list');
        expect(route.params).toEqual(null);
    });

    it('#getActionLabel', () => {

        const label = service.getActionLabel(
            'accounts',
            {
                name: 'list',
                url: './#/accounts/list',
                labelKey: 'LBL_LIST',
                params: null,
                icon: ''
            },
            {
                modStrings: {
                    LBL_LIST: 'List View'
                },
                appStrings: {
                    LBL_LIST: 'List View'
                },
                appListStrings: {},
                languageKey: 'en_us'
            });

        expect(label).toEqual('List View');
    });

    it('#navigate', () => {

        const promise = service.navigate({
            name: 'list',
            url: './#/accounts/list',
            labelKey: 'LBL_LIST',
            params: null,
            icon: ''
        });

        expect(promise).toEqual(null);
    });
});

