import {Injectable} from '@angular/core';
import {Apollo, QueryRef} from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
    providedIn: 'root'
})
export class RecordGQL {

    constructor(private apollo: Apollo) {
    }

    /**
     * Fetch data either from backend or cache
     * @param module to get from
     * @param id of the record
     * @param metadata with the fields to ask for
     */
    public fetch(module: string, id: string, metadata: { fields: string[] }): QueryRef<any> {
        const fields = metadata.fields;
        const iriId = this.formatId(module, id);

        const queryOptions = {
            query: gql`
              query ${module}($id: ID!) {
                ${module}(id: $id) {
                  ${fields.join('\n')}
                }
              }
            `,
            variables: {
                id: iriId,
            },
        };

        return this.apollo.watchQuery(queryOptions);
    }

    /**
     * Format id
     * @param module name
     * @param id of the record
     */
    protected formatId(module: string, id: string) {
        return `/api/${module}s/${id}`;
    }
}