import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {Observable} from 'rxjs';
import {ApolloQueryResult} from 'apollo-client';

@Injectable({
    providedIn: 'root'
})
export class ListGQL {

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
}
