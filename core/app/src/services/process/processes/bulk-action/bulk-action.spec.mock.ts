import {Observable, of} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {RecordMutationGQL} from '@services/api/graphql-api/api.record.create';
import {FetchResult} from 'apollo-link';
import {ProcessService} from '@services/process/process.service';
import {appStateStoreMock} from '@store/app-state/app-state.store.spec.mock';
import {BulkActionProcess} from '@services/process/processes/bulk-action/bulk-action';
import {messageServiceMock} from '@services/message/message.service.spec.mock';
import {redirectBulkActionMock} from '@services/process/processes/bulk-action/actions/redirect/redirect.bulk-action.spec.mock';
import {exportBulkActionMock} from '@services/process/processes/bulk-action/actions/export/export.bulk-action.spec.mock';

export const bulkActionMockData = {
    'bulk-merge': {
        data: {
            createProcess: {
                process: {
                    _id: 'bulk-password',
                    status: 'success',
                    async: false,
                    type: 'bulk-password',
                    messages: [],
                    data: {}
                },
                clientMutationId: null
            }
        }
    }

};

class BulkActionProcessMutationGQLSpy extends RecordMutationGQL {
    constructor() {
        super(null);
    }

    /* eslint-disable @typescript-eslint/no-unused-vars */
    public create(
        graphqlModuleName: string,
        coreModuleName: string,
        input: { [key: string]: any },
        metadata: { fields: string[] }
    ): Observable<FetchResult<any>> {

        return of(bulkActionMockData[input.options.action]).pipe(shareReplay());
    }

    /* eslint-enable @typescript-eslint/no-unused-vars */
}

const processServiceMock = new ProcessService(new BulkActionProcessMutationGQLSpy());

export const bulkActionProcessMock = new BulkActionProcess(
    processServiceMock,
    appStateStoreMock,
    messageServiceMock,
    redirectBulkActionMock,
    exportBulkActionMock
);
