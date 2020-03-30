import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {RecordMutationGQL} from '@services/api/graphql-api/api.record.create';

export interface ProcessOptions {
    [key: string]: any;
}

export interface Process {
    id: string;
    _id: string;
    status: string;
    async: boolean;
    type: string;
    options: ProcessOptions;
    messages: string[];
}

const blankProcess: Process = {
    id: null,
    _id: null,
    status: null,
    async: null,
    type: null,
    options: null,
    messages: []
};


@Injectable({
    providedIn: 'root',
})
export class ProcessService {

    protected graphqlName = 'process';
    protected coreName = 'Process';

    protected fieldsMetadata = {
        fields: [
            'id',
            '_id',
            'status',
            'async',
            'type',
            'options'
        ]
    };

    protected createFieldsMetadata = {
        fields: [
            '_id',
            'status',
            'async',
            'type',
            'messages',
        ]
    };

    constructor(private recordMutationGQL: RecordMutationGQL) {
    }

    /**
     * Public Api
     */

    /**
     * Submit and action/process request
     * Returns observable
     *
     * @returns Observable<any>
     * @param type
     * @param options
     */
    public submit(type: string, options: ProcessOptions): Observable<Process> {
        return this.create(type, options);
    }

    /**
     * Internal API
     */


    /**
     * Create a process on the backend
     *
     * @returns Observable<any>
     * @param type
     * @param options
     */
    protected create(type: string, options: ProcessOptions): Observable<Process> {

        const input = {
            type,
            options
        };

        return this.recordMutationGQL.create(this.graphqlName, this.coreName, input, this.createFieldsMetadata)
            .pipe(map(({data}) => {
                const process: Process = {...blankProcess};

                if (data.createProcess && data.createProcess.process) {
                    return data.createProcess.process;
                }

                return process;
            }));
    }
}
