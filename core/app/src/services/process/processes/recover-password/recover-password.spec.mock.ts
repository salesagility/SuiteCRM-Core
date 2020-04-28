import {Observable, of} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {RecordMutationGQL} from '@services/api/graphql-api/api.record.create';
import {FetchResult} from 'apollo-link';
import {ProcessService} from '@services/process/process.service';
import {appStateFacadeMock} from '@base/facades/app-state/app-state.facade.spec.mock';
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

class RecoverPasswordRecordMutationGQLSpy extends RecordMutationGQL {
    constructor() {
        super(null);
    }

    public create(graphqlModuleName: string,
                  coreModuleName: string,
                  input: { [key: string]: any },
                  metadata: { fields: string[] }): Observable<FetchResult<any>> {

        return of(recoverPasswordMockData).pipe(shareReplay());
    }
}

const processServiceMock = new ProcessService(new RecoverPasswordRecordMutationGQLSpy());

export const recoverPasswordMock = new RecoverPasswordService(processServiceMock, appStateFacadeMock);
