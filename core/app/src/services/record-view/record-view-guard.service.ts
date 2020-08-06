import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {MessageService} from '@services/message/message.service';
import {RecordViewGQL} from '@store/record-view/api.record.get';

@Injectable({
    providedIn: 'root'
})
export class RecordViewGuard implements CanActivate {

    protected fieldsMetadata = {
        fields: [
            '_id',
            'id',
            'record'
        ]
    };

    constructor(
        protected message: MessageService,
        protected recordViewGQL: RecordViewGQL,
        protected router: Router
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        return this.recordViewGQL.fetch(route.params.module, route.params.record, this.fieldsMetadata)
            .pipe(
                map(({data}) => {
                    const id = data.getRecordView.record.id;
                    if (id) {
                        return true;
                    } else {
                        this.message.addDangerMessageByKey('LBL_RECORD_DOES_NOT_EXIST');
                        return false;
                    }
                }),
                catchError(err => throwError(err)),
            );
    }
}
