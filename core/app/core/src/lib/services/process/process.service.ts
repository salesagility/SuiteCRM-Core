import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {EntityMutationGQL} from '../api/graphql-api/api.record.create';

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
    data?: ProcessOptions;
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

    protected createFieldsMetadata = {
        fields: [
            '_id',
            'status',
            'async',
            'type',
            'messages',
            'data'
        ]
    };

    constructor(private recordMutationGQL: EntityMutationGQL) {
    }

    /**
     * Public Api
     */

    /**
     * Submit and action/process request
     * Returns observable
     *
     * @param {string} type to create
     * @param {object} options to send
     * @returns {object} Observable<any>
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
     * @param {string} type to create
     * @param {object} options to send
     * @returns {object} Observable<any>
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
