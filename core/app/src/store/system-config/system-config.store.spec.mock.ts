import {Observable, of} from 'rxjs';
import {shareReplay, take} from 'rxjs/operators';
import {SystemConfigStore} from '@store/system-config/system-config.store';
import {CollectionGQL} from '@services/api/graphql-api/api.collection.get';

/* eslint-disable camelcase, @typescript-eslint/camelcase */
export const systemConfigMockData = {
    systemConfigs: {
        list_max_entries_per_page: {
            id: '/docroot/api/system-configs/list_max_entries_per_page',
            _id: 'list_max_entries_per_page',
            value: '20',
            items: []
        },
        default_language: {
            id: '/docroot/api/system-configs/default_language',
            _id: 'default_language',
            value: 'en_us',
            items: []
        },
        default_number_grouping_seperator: {
            id: '/docroot/api/system-configs/default_number_grouping_seperator',
            _id: 'default_number_grouping_seperator',
            value: ';',
            items: []
        },
        default_decimal_seperator: {
            id: '/docroot/api/system-configs/default_decimal_seperator',
            _id: 'default_decimal_seperator',
            value: ',',
            items: []
        },
        passwordsetting: {
            id: '/docroot/api/system-configs/passwordsetting',
            _id: 'passwordsetting',
            value: null,
            items: {
                forgotpasswordON: false
            }
        },
        languages: {
            id: '/docroot/api/system-configs/languages',
            _id: 'languages',
            value: null,
            items: {
                en_us: 'English (US)',
                pt_PT: 'Português (Portugal) - pt-PT'
            }
        },
        listview_column_limits: {
            id: '/docroot/api/system-configs/listview_column_limits',
            _id: 'listview_column_limits',
            value: null,
            items: {
                with_sidebar: {
                    XSmall: 2,
                    Small: 3,
                    Medium: 4,
                    Large: 6,
                    XLarge: 7
                },
                without_sidebar: {
                    XSmall: 2,
                    Small: 3,
                    Medium: 5,
                    Large: 7,
                    XLarge: 8
                }
            }
        },
        listview_settings_limits: {
            id: '/docroot/api/system-configs/listview_settings_limits',
            _id: 'listview_settings_limits',
            value: null,
            items: {
                XSmall: 2,
                Small: 3,
                Medium: 4,
                Large: 6,
                XLarge: 7
            }
        },
        listview_actions_limits: {
            id: '/docroot/api/system-configs/listview_actions_limits',
            _id: 'listview_actions_limits',
            value: null,
            items: {
                XSmall: 2,
                Small: 3,
                Medium: 4,
                Large: 6,
                XLarge: 7
            }
        },
        date_format: {
            id: '/docroot/api/system-configs/date_format',
            _id: 'date_format',
            value: 'dd.MM.yyyy',
            items: []
        },
        time_format: {
            id: '/docroot/api/system-configs/time_format',
            _id: 'time_format',
            value: 'HH.mm.ss',
            items: []
        }
    }
};

/* eslint-enable camelcase, @typescript-eslint/camelcase */

class SystemConfigRecordGQLSpy extends CollectionGQL {

    constructor() {
        super(null);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public fetchAll(module: string, metadata: { fields: string[] }): Observable<any> {
        const data = {
            data: {
                systemConfigs: {
                    edges: []
                }
            }
        };

        Object.keys(systemConfigMockData.systemConfigs).forEach(key => {
            data.data.systemConfigs.edges.push({
                node: systemConfigMockData.systemConfigs[key]
            });
        });

        return of(data).pipe(shareReplay());
    }
}

export const systemConfigStoreMock = new SystemConfigStore(new SystemConfigRecordGQLSpy());
systemConfigStoreMock.load().pipe(take(1)).subscribe();
