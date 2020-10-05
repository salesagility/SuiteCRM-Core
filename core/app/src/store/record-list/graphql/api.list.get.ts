import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {Observable} from 'rxjs';
import {ApolloQueryResult} from 'apollo-client';
import {SearchCriteria} from '@app-common/views/list/search-criteria.model';
import {map} from 'rxjs/operators';
import {RecordList} from '@store/record-list/record-list.store';
import {Pagination, SortingSelection} from '@app-common/views/list/list-navigation.model';

@Injectable({
    providedIn: 'root'
})
export class ListGQL {

    protected fieldsMetadata = {
        fields: [
            'id',
            '_id',
            'meta',
            'records'
        ]
    };

    constructor(private apollo: Apollo) {
    }

    /**
     * Fetch data either from backend
     *
     * @param {string} module to get from
     * @param {number} limit  page limit
     * @param {number} offset  current offset
     * @param {object} criteria filter criteria
     * @param {object} sort selection
     * @param {object} metadata with the fields to ask for
     * @returns {object} Observable<ApolloQueryResult<any>>
     */
    public fetch(
        module: string,
        limit: number,
        offset: number,
        criteria: { [key: string]: any },
        sort: { [key: string]: any },
        metadata: { fields: string[] }
    ): Observable<ApolloQueryResult<any>> {

        const fields = metadata.fields;

        const queryOptions = {
            query: gql`
              query getRecordList($module: String!, $limit: Int, $offset: Int, $criteria: Iterable, $sort: Iterable) {
                getRecordList(module: $module, limit: $limit, offset: $offset, criteria: $criteria, sort: $sort) {
                  ${fields.join('\n')}
                }
              }
            `,
            variables: {
                module,
                limit,
                offset,
                criteria,
                sort
            },
        };

        return this.apollo.query(queryOptions);
    }

    /**
     * Fetch the List records from the backend
     *
     * @param {string} module to use
     * @param {object} criteria to use
     * @param {object} sort to use
     * @param {object} pagination to use
     * @returns {object} Observable<any>
     */
    public get(module: string, criteria: SearchCriteria, sort: SortingSelection, pagination: Pagination): Observable<RecordList> {
        const mappedSort = this.mapSort(sort);

        return this.fetch(module, pagination.pageSize, pagination.current, criteria, mappedSort, this.fieldsMetadata)
            .pipe(map(({data}) => {
                const recordsList: RecordList = {
                    records: [],
                    pagination: {...pagination} as Pagination
                };

                if (!data || !data.getRecordList) {
                    return recordsList;
                }

                const listData = data.getRecordList;

                if (listData.records) {
                    listData.records.forEach((record: any) => {
                        recordsList.records.push(
                            record
                        );
                    });
                }

                if (!listData.meta) {
                    return recordsList;
                }

                if (listData.meta.offsets) {

                    const paginationFieldMap = {
                        current: 'current',
                        next: 'next',
                        prev: 'previous',
                        total: 'total',
                        end: 'last',
                    };

                    Object.keys(paginationFieldMap).forEach((key) => {
                        if (key in listData.meta.offsets) {
                            const paginationField = paginationFieldMap[key];
                            recordsList.pagination[paginationField] = listData.meta.offsets[key];
                        }
                    });
                }

                return recordsList;
            }));
    }

    protected mapSort(sort: SortingSelection): { [key: string]: string } {
        const sortOrderMap = {
            NONE: '',
            ASC: 'ASC',
            DESC: 'DESC'
        };

        return {
            sortOrder: sortOrderMap[sort.sortOrder],
            orderBy: sort.orderBy
        };
    }
}
