import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

import { RecordGQL } from '../../api/graphql-api/api.record.get';


@Injectable({
    providedIn: 'root',
})
export class NavigationMetadata {
    protected resourceName = 'navbar';
    protected fieldsMetadata = {
        fields: [
            'NonGroupedTabs',
            'groupedTabs',
            'userActionMenu'
        ]
    };

    constructor(private recordGQL: RecordGQL) {}

    public fetch(): Observable<any> {
        const id = '1';

        return this.recordGQL
            .fetch(this.resourceName, id, this.fieldsMetadata)
            .valueChanges.pipe(map(({data}) => data.navbar));
    }
}