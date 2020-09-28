import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {Observable} from 'rxjs';
import {ApolloQueryResult} from 'apollo-client';

@Injectable({
    providedIn: 'root'
})
export class EntityGQL {

    constructor(private apollo: Apollo) {
    }

    /**
     * Fetch data either from backend or cache
     *
     * @param {string} entity to get from
     * @param {string} id of the record
     * @param {object} metadata with the fields to ask for
     *
     * @returns {object}  Observable<ApolloQueryResult<any>>
     */
    public fetch(entity: string, id: string, metadata: { fields: string[] }): Observable<ApolloQueryResult<any>> {
        const fields = metadata.fields;

        const queryOptions = {
            query: gql`
              query ${entity}($id: ID!) {
                ${entity}(id: $id) {
                  ${fields.join('\n')}
                }
              }
            `,
            variables: {
                id,
            },
        };

        return this.apollo.query(queryOptions);
    }
}
