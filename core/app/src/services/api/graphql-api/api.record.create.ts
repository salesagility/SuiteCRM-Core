import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {Observable} from 'rxjs';
import {FetchResult} from 'apollo-link';

@Injectable({
    providedIn: 'root'
})
export class RecordMutationGQL {

    constructor(private apollo: Apollo) {
    }

    /**
     * Create record on the backend
     *
     * @param moduleGraphQLName to get from
     * @param moduleCoreName to get from
     * @param input
     * @param metadata with the fields to ask for
     * @returns Observable<any>
     */
    public create(graphqlModuleName: string,
                  coreModuleName: string,
                  input: { [key: string]: any },
                  metadata: { fields: string[] }): Observable<FetchResult<any>> {

        const fields = metadata.fields;
        const mutationOptions = {
            mutation: gql`
                mutation create${coreModuleName}($input: create${coreModuleName}Input!) {
                  create${coreModuleName}(input: $input) {
                    ${graphqlModuleName} {
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
