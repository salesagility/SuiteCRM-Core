import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Process, ProcessService} from '@services/process/process.service';
import {AppStateFacade} from '@base/facades/app-state/app-state.facade';

@Injectable({
    providedIn: 'root',
})
export class RecoverPasswordService {

    protected processType = 'recover-password';

    constructor(private processService: ProcessService, private appStateFacade: AppStateFacade) {
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

        this.appStateFacade.updateLoading('recover-password', true);

        return this.processService
            .submit(this.processType, options)
            .pipe(
                tap(() => this.appStateFacade.updateLoading('recover-password',false)),
                catchError(err => {
                    this.appStateFacade.updateLoading('recover-password',false);
                    throw err;
                }),
            );
    }
}
