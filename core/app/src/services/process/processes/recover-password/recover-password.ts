import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Process, ProcessService} from '@services/process/process.service';
import {AppStateStore} from '@store/app-state/app-state.store';

@Injectable({
    providedIn: 'root',
})
export class RecoverPasswordService {

    protected processType = 'recover-password';

    constructor(private processService: ProcessService, private appStateStore: AppStateStore) {
    }

    /**
     * Send recover password request
     *
     * @param {string} userName to check
     * @param {string} email to check
     * @returns {{}} Observable<Process>
     */
    public run(userName: string, email: string): Observable<Process> {
        const options = {
            username: userName,
            useremail: email
        };

        this.appStateStore.updateLoading('recover-password', true);

        return this.processService
            .submit(this.processType, options)
            .pipe(
                tap(() => this.appStateStore.updateLoading('recover-password',false)),
                catchError(err => {
                    this.appStateStore.updateLoading('recover-password',false);
                    throw err;
                }),
            );
    }
}
