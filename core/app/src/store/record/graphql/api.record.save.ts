import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {Observable} from 'rxjs';
import {Record} from '@app-common/record/record.model';
import {map} from 'rxjs/operators';
import {ApolloQueryResult} from 'apollo-client';

interface SaveInput {
    module: string;
    attributes: { [key: string]: any };
    _id?: string;
}

@Injectable({
    providedIn: 'root'
})
export class RecordSaveGQL {

    constructor(private apollo: Apollo) {
    }

    /**
     * Save record on the backend
     *
     * @param {object} record to save
     *
     * @returns {object} Observable<Record>
     */
    public save(record: Record): Observable<Record> {

        const input: SaveInput = {
            module: record.module,
            attributes: record.attributes,
        };

        if (record.id) {
            // eslint-disable-next-line no-underscore-dangle
            input._id = record.id;
        }

        const mutationOptions = {
            mutation: gql`
                mutation saveRecord($input: saveRecordInput!) {
                  saveRecord(input: $input) {
                    record {
                        attributes
                        id
                        _id
                        module
                    }
                  }
                }
            `,
            variables: {
                input
            },
        };

        return this.apollo.mutate(mutationOptions).pipe(map((result: ApolloQueryResult<any>) => this.mapToRecord(result)));
    }

    protected mapToRecord(response: ApolloQueryResult<any>): Record {
        if (!response.data || !response.data.saveRecord || !response.data.saveRecord.record) {
            return null;
        }

        return {
            // eslint-disable-next-line no-underscore-dangle
            id: response.data.saveRecord.record._id,
            type: response.data.saveRecord.record.type || '',
            module: response.data.saveRecord.record.module || '',
            attributes: response.data.saveRecord.record.attributes || '',
        } as Record;
    }
}
