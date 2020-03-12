import {Injectable} from '@angular/core';
import {Apollo, QueryRef} from 'apollo-angular';
import gql from 'graphql-tag';
import {Observable} from 'rxjs';
import {ApolloQueryResult} from 'apollo-client';

@Injectable({
    providedIn: 'root'
})
export class CollectionGQL {

    constructor(private apollo: Apollo) {
    }

    /**
     * Fetch data either from backend or cache
     *
     * @param module to get from
     * @param metadata with the fields to ask for
     */
    public fetchAll(module: string, metadata: { fields: string[] }): Observable<ApolloQueryResult<any>> {
        const fields = metadata.fields;

        const queryOptions = {
            query: gql`
                query ${module}{
                    ${module} {
                        edges {
                            node {
                                ${fields.join('\n')}
                            }
                        }
                    }
                }
            `
        };

        return this.apollo.query(queryOptions);
    }
}
