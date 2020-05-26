import {Observable, BehaviorSubject} from 'rxjs';
import {DataSource} from '@angular/cdk/table';

export interface Field {
    value: string;
}

export interface FieldMap {
    [key: string]: Field;
}

export interface Record {
    fields: FieldMap;
    id: string;
}


export class MockDataSource extends DataSource<Record> {
    /** Stream of data that is provided to the table. */
    data = new BehaviorSubject<Record[]>(
        [
            {
                id: '1',
                fields: {}
            }
        ]
    );


    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<Record[]> {
        return this.data;
    }

    disconnect() {
    }
}
