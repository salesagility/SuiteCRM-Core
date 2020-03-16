import {RecordGQL} from '@services/api/graphql-api/api.record.get';
import {Observable, of} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {LanguageFacade} from '@base/facades/language/language.facade';
import {appStateFacadeMock} from '@base/facades/app-state/app-state.facade.spec.mock';

export const languageMockData = {
    appStrings: {
        LBL_SEARCH_REAULTS_TITLE: 'Results',
        ERR_SEARCH_INVALID_QUERY: 'An error has occurred while performing the search. Your query syntax might not be valid.',
        ERR_SEARCH_NO_RESULTS: 'No results matching your search criteria. Try broadening your search.',
        LBL_SEARCH_PERFORMED_IN: 'Search performed in',
        LBL_EMAIL_CODE: 'Email Code:',
        LBL_SEND: 'Send',
        LBL_LOGOUT: 'Logout',
        LBL_TOUR_NEXT: 'Next',
    },
    appListStrings: {
        language_pack_name: 'US English',
        moduleList: {
            Home: 'Home',
            Accounts: 'Accounts',
        }
    },
    modStrings: {
        home: {
            LBL_MODULE_NAME: 'Home',
            LBL_NEW_FORM_TITLE: 'New Contact',
            LBL_FIRST_NAME: 'First Name:',
            LBL_LAST_NAME: 'Last Name:',
            LBL_LIST_LAST_NAME: 'Last Name',
            LBL_PHONE: 'Phone:',
            LBL_EMAIL_ADDRESS: 'Email Address:',
            LBL_MY_PIPELINE_FORM_TITLE: 'My Pipeline',
            LBL_PIPELINE_FORM_TITLE: 'Pipeline By Sales Stage',
            LBL_RGraph_PIPELINE_FORM_TITLE: 'Pipeline By Sales Stage',
            LNK_NEW_CONTACT: 'Create Contact',
            LNK_NEW_ACCOUNT: 'Create Account',
            LNK_NEW_OPPORTUNITY: 'Create Opportunity',
            LNK_NEW_LEAD: 'Create Lead',
            LNK_NEW_CASE: 'Create Case',
            LNK_NEW_NOTE: 'Create Note or Attachment',
            LNK_NEW_CALL: 'Log Call',
            LNK_NEW_EMAIL: 'Archive Email',
            LNK_NEW_MEETING: 'Schedule Meeting',
            LNK_NEW_TASK: 'Create Task',
            LNK_NEW_BUG: 'Report Bug',
            LNK_NEW_SEND_EMAIL: 'Compose Email',
            LBL_NO_ACCESS: 'You do not have access'
        },
        accounts: {
            LBL_ID: 'ID',
            LBL_NAME: 'Name:',
            LBL_LIST_NAME: 'Name',
            LNK_ACCOUNT_LIST: 'View Accounts',
            LNK_NEW_ACCOUNT: 'Create Account',
            LBL_MODULE_NAME: 'Accounts',
            LBL_MODULE_TITLE: 'Accounts: Home',
            LBL_MODULE_ID: 'Accounts',
            LBL_NEW_FORM_TITLE: 'New Account',
        },
    }
};


class LanguageRecordGQLSpy extends RecordGQL {

    constructor() {
        super(null);
    }

    public fetch(module: string, id: string, metadata: { fields: string[] }): Observable<any> {
        if (module === 'appStrings') {

            return of({
                data: {
                    appStrings: {
                        _id: 'en_us',
                        items: languageMockData.appStrings
                    }
                }
            }).pipe(shareReplay());
        }

        if (module === 'appListStrings') {
            return of({
                data: {
                    appListStrings: {
                        _id: 'en_us',
                        items: languageMockData.appListStrings
                    }
                }
            }).pipe(shareReplay());
        }

        if (module === 'modStrings') {
            return of({
                data: {
                    modStrings: {
                        _id: 'en_us',
                        items: languageMockData.modStrings
                    }
                }
            }).pipe(shareReplay());
        }
    }
}

export const languageFacadeMock = new LanguageFacade(new LanguageRecordGQLSpy(), appStateFacadeMock);
