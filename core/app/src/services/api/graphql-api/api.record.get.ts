import {Injectable} from '@angular/core';
import {Apollo, QueryRef} from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
    providedIn: 'root',
})
export class RecordGQL {

    constructor(private apollo: Apollo) {
    }

    /**
     * Fetch data either from backend or cache
     * @param module
     * @param id
     * @param metadata
     */
    public fetch(module: string, id: string, metadata: { fields: string[] }): QueryRef<any> {
        const fields = metadata.fields;
        const iriId = this.formatId(module, id);

        let queryOptions = {
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
     * Get in memory cache data
     * @param module
     * @param id
     * @param metadata
     */
    public get(module: string, id: string, metadata: { fields: string[] }): any {
        const fields = metadata.fields;
        const iriId = this.formatId(module, id);

        let queryOptions = {
            id: iriId,
            fragment: gql`
              fragment my${module} on ${module} {
                 ${fields.join('\n')}
              }
            `
        };

        return this.apollo.getClient().readFragment(queryOptions);
    }

    /**
     * Format id
     * @param module
     * @param id
     */
    protected formatId(module: string, id: string) {
        return `/api/${module}s/${id}`;
    }
}