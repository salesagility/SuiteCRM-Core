import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {Observable} from 'rxjs';
import {ApolloQueryResult} from 'apollo-client';

@Injectable({
    providedIn: 'root'
})
export class ClassicViewGQL {

    constructor(private apollo: Apollo) {
    }

    /**
     * Fetch data either from backend
     *
     * @param module to get from
     * @param id of the record
     * @param params
     * @param metadata with the fields to ask for
     */
    public fetch(module: string,
                 params: { [key: string]: string },
                 metadata: { fields: string[] }): Observable<ApolloQueryResult<any>> {

        const fields = metadata.fields;

        const queryOptions = {
            query: gql`
              query getClassicView($module: String!, $params: Iterable) {
                getClassicView(module:$module, params:$params) {
                  ${fields.join('\n')}
                }
              }
            `,
            variables: {
                module,
                params
            },
        };

        return this.apollo.query(queryOptions);
    }
}
