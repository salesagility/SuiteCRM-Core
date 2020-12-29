import {Record} from '@app-common/record/record.model';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {AsyncValidatorFn} from '@angular/forms';

export interface AsyncValidatorInterface {

    applies(record: Record, viewField: ViewFieldDefinition): boolean;

    getValidator(viewField: ViewFieldDefinition, record: Record): AsyncValidatorFn;
}
