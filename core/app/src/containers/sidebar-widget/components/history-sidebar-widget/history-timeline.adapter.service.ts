import {Injectable} from '@angular/core';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {HistoryTimelineEntry} from './history-sidebar-widget.model';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';

/* eslint-disable camelcase, @typescript-eslint/camelcase */
const mockRecord = {
    type: 'Account',
    module: 'accounts',
    id: '47f0a247-4f34-e5c4-ffc3-5f7edecddb44',
    attributes: {
        name: 'V8 Api test Account',
        date_entered: '2020-10-08 09:39:00',
        date_modified: '2020-10-08 09:39:00',
        modified_user_id: '1',
        modified_by_name: {
            user_name: 'admin',
            id: '1'
        },
        created_by: '1',
        created_by_name: {
            user_name: 'admin',
            id: '1'
        },
        description: 'aaaa',
        deleted: '0',
        assigned_user_id: '',
        assigned_user_name: {
            user_name: 'admin',
            id: '1'
        },
        account_type: '',
        industry: '',
        annual_revenue: '',
        phone_fax: '',
        billing_address_street: '',
        billing_address_street_2: '',
        billing_address_street_3: '',
        billing_address_street_4: '',
        billing_address_city: '',
        billing_address_state: '',
        billing_address_postalcode: '',
        billing_address_country: '',
        rating: '',
        phone_office: '',
        phone_alternate: '',
        website: 'WebSitelogic hook: website = name| V8 Api test Account',
        ownership: '',
        employees: '',
        ticker_symbol: '',
        shipping_address_street: '',
        shipping_address_street_2: '',
        shipping_address_street_3: '',
        shipping_address_street_4: '',
        shipping_address_city: '',
        shipping_address_state: '',
        shipping_address_postalcode: '',
        shipping_address_country: '',
        email1: '',
        email_addresses_non_primary: '',
        parent_id: '',
        sic_code: '',
        parent_name: {
            name: '',
            id: ''
        },
        email_opt_out: '',
        invalid_email: '',
        email: '',
        campaign_id: '',
        campaign_name: {
            name: '',
            id: ''
        },
        jjwg_maps_address_c: '',
        jjwg_maps_geocode_status_c: '',
        jjwg_maps_lat_c: '0.00000000',
        jjwg_maps_lng_c: '0.00000000'
    },
    relationships: []
};

const mockTitleField = {
    type: 'varchar',
    value: 'title',
    definition: {
        name: 'name',
        type: 'varchar',
        vname: 'LBL_TITLE',
    }
};

const mockUserField = {
    type: 'varchar',
    definition: {
        name: 'assigned_user_name',
        link: 'assigned_user_link',
        vname: 'LBL_ASSIGNED_TO_NAME',
        rname: 'user_name',
        type: 'relate',
        reportable: false,
        source: 'non-db',
        table: 'users',
        id_name: 'assigned_user_id',
        module: 'Users',
        required: false
    },
    labelKey: 'LBL_ASSIGNED_TO',
    label: 'Assigned to',
    value: 'admin'
};

const mockDateField = {
    type: 'datetime',
    value: '2020-10-20 10:50:00',
    name: 'date_entered',
    definition: {
        name: 'date_entered',
        vname: 'LBL_DATE_ENTERED',
        type: 'datetime',
        group: 'created_by_name',
        comment: 'Date record created',
        enable_range_search: true,
        options: 'date_range_search_dom',
        inline_edit: false
    }
};

/* eslint-enable camelcase, @typescript-eslint/camelcase */


@Injectable()
export class HistoryTimelineAdapter extends DataSource<HistoryTimelineEntry> {
    private mockEntries: HistoryTimelineEntry[] = [
        {
            title: {
                ...mockTitleField,
                value: 'Upcoming Call with Douglas Lees'
            },
            module: 'calls',
            icon: 'Calls',
            color: 'yellow',
            user: {
                ...mockUserField,
                value: 'Joe Bloggs',
            },
            date: {
                ...mockDateField,
                value: '2020-11-20 15:30:00',
            },
            record: mockRecord
        } as HistoryTimelineEntry,
        {
            title: {
                ...mockTitleField,
                value: 'Status changed to Converted'
            },
            module: 'history',
            icon: 'History',
            color: 'purple',
            user: {
                ...mockUserField,
                value: 'Joe Bloggs',
            },
            date: {
                ...mockDateField,
                value: '2020-10-20 10:52:00',
            },
            record: mockRecord
        } as HistoryTimelineEntry,
        {
            title: {
                ...mockTitleField,
                value: 'Meeting held with Douglas Lees to gather project requirements'
            },
            module: 'meetings',
            icon: 'Meetings',
            color: 'blue',
            user: {
                ...mockUserField,
                value: 'Joe Bloggs',
            },
            date: {
                ...mockDateField,
                value: '2020-9-5 9:30:00',
            },
            record: mockRecord
        } as HistoryTimelineEntry,
        {
            title: {
                ...mockTitleField,
                value: 'Call held with Douglas Lees to discuss potential opportunities'
            },
            module: 'calls',
            icon: 'Calls',
            color: 'yellow',
            user: {
                ...mockUserField,
                value: 'Admin',
            },
            date: {
                ...mockDateField,
                value: '2020-9-4 11:24:00',
            },
            record: mockRecord
        } as HistoryTimelineEntry,
        {
            title: {
                ...mockTitleField,
                value: 'Status changed to Researching'
            },
            module: 'history',
            icon: 'History',
            color: 'purple',
            user: {
                ...mockUserField,
                value: 'Admin',
            },
            date: {
                ...mockDateField,
                value: '2020-9-3 15:11:00',
            },
            record: mockRecord
        } as HistoryTimelineEntry,
    ];
    private cache: HistoryTimelineEntry[] = [...this.mockEntries];
    private dataStream = new BehaviorSubject<HistoryTimelineEntry[]>(this.cache);
    private subscription = new Subscription();
    private fetchedPages = new Set<number>();
    private pageSize = 5;

    constructor() {
        super();
    }

    connect(collectionViewer: CollectionViewer): Observable<HistoryTimelineEntry[] | ReadonlyArray<HistoryTimelineEntry>> {
        this.subscription.add(collectionViewer.viewChange.subscribe(range => {
            const startPage = this.getPageForIndex(range.start);
            const endPage = this.getPageForIndex(range.end - 1);
            for (let i = startPage; i <= endPage; i++) {
                // TODO to be used when live data is used
                // this.fetchPage(i);
            }
        }));
        return this.dataStream.asObservable();
    }

    disconnect(): void {
        this.subscription.unsubscribe();
    }

    // TODO to be used when live data is used
    private fetchPage(page: number): void {
        if (this.fetchedPages.has(page)) {
            return;
        }
        this.fetchedPages.add(page);

        this.cache.splice(
            page * this.pageSize,
            this.pageSize,
            ...Array(this.pageSize).map((_, i) => this.mockEntries[i % this.mockEntries.length])
        );

        this.dataStream.next(this.cache);
    }

    private getPageForIndex(i: number): number {
        return Math.floor(i / this.pageSize);
    }
}
