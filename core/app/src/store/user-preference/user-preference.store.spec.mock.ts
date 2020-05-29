import {Observable, of} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {CollectionGQL} from '@services/api/graphql-api/api.collection.get';
import {UserPreferenceStore} from '@store/user-preference/user-preference.store';

export const userPreferenceMockData = {
    userPreferences: {
        global: {
            id: '/api/user-preferences/global',
            _id: 'global',
            value: null,
            items: {
                calendar_publish_key: 'cc360e7b-c31c-5a12-4716-5e692263f2c8',
                swap_shortcuts: '',
                navigation_paradigm: 'gm',
                sort_modules_by_name: '',
                subpanel_tabs: '',
                count_collapsed_subpanels: '',
                module_favicon: '',
                no_opps: 'off',
                timezone: 'UTC',
                ut: '1',
                mail_smtpserver: '',
                mail_smtpport: '25',
                mail_smtpuser: '',
                mail_smtppass: '',
                use_real_names: 'off',
                mail_smtpauth_req: '',
                mail_smtpssl: 0,
                email_show_counts: 0,
                user_theme: 'SuiteP',
                editor_type: 'mozaik',
                reminder_time: '60',
                email_reminder_time: '60',
                reminder_checked: '0',
                email_reminder_checked: '0',
                currency: '-99',
                default_currency_significant_digits: '2',
                num_grp_sep: ',',
                dec_sep: '.',
                fdow: '0',
                datef: 'm/d/Y',
                timef: 'H:i',
                default_locale_name_format: 's f l',
                export_delimiter: ',',
                default_export_charset: 'UTF-8',
                email_link_type: 'sugar',
                subtheme: 'Dawn'
            }
        }
    }
};

class UserPreferenceRecordGQLSpy extends CollectionGQL {

    constructor() {
        super(null);
    }

    public fetchAll(module: string, metadata: { fields: string[] }): Observable<any> {
        const data = {
            data: {
                userPreferences: {
                    edges: []
                }
            }
        };

        Object.keys(userPreferenceMockData.userPreferences).forEach(key => {
            data.data.userPreferences.edges.push({
                node: userPreferenceMockData.userPreferences[key]
            });
        });

        return of(data).pipe(shareReplay());
    }
}

export const userPreferenceStoreMock = new UserPreferenceStore(new UserPreferenceRecordGQLSpy());
