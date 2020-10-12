import {Observable} from 'rxjs';
import {Panel} from '@app-common/metadata/metadata.model';
import {ViewMode} from '@app-common/views/view.model';
import {FieldMap} from '@app-common/record/field.model';
import {Record} from '@app-common/record/record.model';

export interface FieldLayoutConfig {
    mode: ViewMode;
    maxColumns: number;
}

export interface FieldLayoutDataSource {
    inlineEdit: boolean;

    getEditAction(): void;

    getConfig(): Observable<FieldLayoutConfig>;

    getLayout(): Observable<Panel>;

    getFields(): Observable<FieldMap>;

    getRecord(): Observable<Record>;
}
