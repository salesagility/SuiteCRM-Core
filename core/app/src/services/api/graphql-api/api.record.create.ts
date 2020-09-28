import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {Observable} from 'rxjs';
import {FetchResult} from 'apollo-link';

@Injectable({
    providedIn: 'root'
})
export class EntityMutationGQL {

    constructor(private apollo: Apollo) {
    }

    /**
     * Create record on the backend
     *
     * @param {string} graphqlEntityName to use
     * @param {string} entityName to use
     * @param {object} input values
     * @param {object} metadata with the fields to ask for
     *
     * @returns {object} Observable<any>
     */
    public create(graphqlEntityName: string,
                  entityName: string,
                  input: { [key: string]: any },
                  metadata: { fields: string[] }): Observable<FetchResult<any>> {

        const fields = metadata.fields;
        const mutationOptions = {
            mutation: gql`
                mutation create${entityName}($input: create${entityName}Input!) {
                  create${entityName}(input: $input) {
                    ${graphqlEntityName} {
                      ${fields.join('\n')}
                    }
                    clientMutationId
                  }
                }
            `,
            variables: {
                input
            },
        };

        return this.apollo.mutate(mutationOptions);
    }
}
