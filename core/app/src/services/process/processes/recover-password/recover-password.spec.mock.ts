import {Observable, of} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {EntityMutationGQL} from '@services/api/graphql-api/api.record.create';
import {FetchResult} from '@apollo/client/core';
import {ProcessService} from '@services/process/process.service';
import {appStateStoreMock} from '@store/app-state/app-state.store.spec.mock';
import {RecoverPasswordService} from '@services/process/processes/recover-password/recover-password';

export const recoverPasswordMockData = {
    data: {
        createProcess: {
            process: {
                _id: 'recover-password',
                status: 'success',
                async: false,
                type: 'recover-password',
                messages: [
                    'LBL_RECOVER_PASSWORD_SUCCESS'
                ]
            },
            clientMutationId: null
        }
    }
};

class RecoverPasswordRecordMutationGQLSpy extends EntityMutationGQL {
    constructor() {
        super(null);
    }


    public create(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        graphqlModuleName: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        coreModuleName: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        input: { [key: string]: any },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        metadata: { fields: string[] }
    ): Observable<FetchResult<any>> {

        return of(recoverPasswordMockData).pipe(shareReplay());
    }
}

const processServiceMock = new ProcessService(new RecoverPasswordRecordMutationGQLSpy());

export const recoverPasswordMock = new RecoverPasswordService(processServiceMock, appStateStoreMock);
