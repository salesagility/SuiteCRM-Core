import {RecordGQL} from '@services/api/graphql-api/api.record.get';
import {Observable, of} from 'rxjs';
import {shareReplay, take} from 'rxjs/operators';
import {appStateStoreMock} from '@store/app-state/app-state.store.spec.mock';
import {MetadataStore} from '@store/metadata/metadata.store.service';

/* eslint-disable camelcase, @typescript-eslint/camelcase */
export const metadataMockData = {
    search: {
        layout: {
            basic: {
                name: {
                    name: 'name',
                    label: 'LBL_NAME',
                    fieldType: 'name',
                    default: true,
                    width: '10%'
                },
                current_user_only: {
                    name: 'current_user_only',
                    label: 'LBL_CURRENT_USER_FILTER',
                    type: 'bool',
                    default: true,
                    width: '10%'
                },
                favorites_only: {
                    name: 'favorites_only',
                    label: 'LBL_FAVORITES_FILTER',
                    type: 'bool'
                }
            },
            advanced: {
                name: {
                    name: 'name',
                    label: 'LBL_NAME',
                    fieldType: 'name',
                    default: true,
                    width: '10%'
                },
                website: {
                    name: 'website',
                    label: 'LBL_WEBSITE',
                    fieldType: 'url',
                    default: true,
                    width: '10%'
                },
                phone: {
                    name: 'phone',
                    label: 'LBL_ANY_PHONE',
                    type: 'name',
                    default: true,
                    width: '10%'
                },
                email: {
                    name: 'email',
                    label: 'LBL_ANY_EMAIL',
                    fieldType: 'email',
                    type: 'name',
                    default: true,
                    width: '10%'
                },
                address_street: {
                    name: 'address_street',
                    label: 'LBL_ANY_ADDRESS',
                    type: 'name',
                    default: true,
                    width: '10%'
                },
                address_city: {
                    name: 'address_city',
                    label: 'LBL_CITY',
                    type: 'name',
                    default: true,
                    width: '10%'
                },
                address_state: {
                    name: 'address_state',
                    label: 'LBL_STATE',
                    type: 'name',
                    default: true,
                    width: '10%'
                },
                address_postalcode: {
                    name: 'address_postalcode',
                    label: 'LBL_POSTAL_CODE',
                    type: 'name',
                    default: true,
                    width: '10%'
                },
                billing_address_country: {
                    name: 'billing_address_country',
                    label: 'LBL_COUNTRY',
                    fieldType: 'varchar',
                    type: 'name',
                    options: 'countries_dom',
                    default: true,
                    width: '10%'
                },
                account_type: {
                    name: 'account_type',
                    options: 'account_type_dom',
                    label: 'LBL_TYPE',
                    fieldType: 'enum',
                    default: true,
                    width: '10%'
                },
                industry: {
                    name: 'industry',
                    options: 'industry_dom',
                    label: 'LBL_INDUSTRY',
                    fieldType: 'enum',
                    default: true,
                    width: '10%'
                },
                assigned_user_id: {
                    name: 'assigned_user_id',
                    label: 'LBL_ASSIGNED_TO',
                    fieldType: 'relate',
                    type: 'enum',
                    function: {
                        name: 'get_user_array',
                        params: [
                            false
                        ]
                    },
                    default: true,
                    width: '10%'
                }
            }
        }
    },
    listView: [
        {
            fieldName: 'name',
            width: '20%',
            label: 'LBL_LIST_ACCOUNT_NAME',
            link: true,
            default: true,
            module: '',
            id: '',
            sortable: false
        },
        {
            fieldName: 'billing_address_city',
            width: '10%',
            label: 'LBL_LIST_CITY',
            link: false,
            default: true,
            module: '',
            id: '',
            sortable: false
        },
        {
            fieldName: 'billing_address_country',
            width: '10%',
            label: 'LBL_BILLING_ADDRESS_COUNTRY',
            link: false,
            default: true,
            module: '',
            id: '',
            sortable: false
        },
        {
            fieldName: 'phone_office',
            width: '10%',
            label: 'LBL_LIST_PHONE',
            link: false,
            default: true,
            module: '',
            id: '',
            sortable: false
        },
        {
            fieldName: 'assigned_user_name',
            width: '10%',
            label: 'LBL_LIST_ASSIGNED_USER',
            link: false,
            default: true,
            module: 'Employees',
            id: 'ASSIGNED_USER_ID',
            sortable: false
        },
        {
            fieldName: 'email1',
            width: '15%',
            label: 'LBL_EMAIL_ADDRESS',
            link: true,
            default: true,
            module: '',
            id: '',
            sortable: false,
            customCode: '{$EMAIL1_LINK}'
        },
        {
            fieldName: 'date_entered',
            width: '5%',
            label: 'LBL_DATE_ENTERED',
            link: false,
            default: true,
            module: '',
            id: '',
            sortable: false
        }
    ]
};

/* eslint-enable camelcase, @typescript-eslint/camelcase */


class MetadataRecordGQLSpy extends RecordGQL {

    constructor() {
        super(null);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public fetch(module: string, id: string, metadata: { fields: string[] }): Observable<any> {

        return of({
            data: {
                viewDefinition: metadataMockData
            }
        }).pipe(shareReplay(1));
    }
}

export const metadataStoreMock = new MetadataStore(new MetadataRecordGQLSpy(), appStateStoreMock);
metadataStoreMock.load('accounts', metadataStoreMock.getMetadataTypes()).pipe(take(1)).subscribe();
