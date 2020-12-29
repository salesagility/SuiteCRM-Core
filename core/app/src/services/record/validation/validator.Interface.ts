import {Record} from '@app-common/record/record.model';
import {ViewFieldDefinition} from '@app-common/metadata/metadata.model';
import {StandardValidatorFn} from '@app-common/services/validators/validators.model';

export interface ValidatorInterface {
    applies(record: Record, viewField: ViewFieldDefinition): boolean;

    getValidator(viewField: ViewFieldDefinition, record: Record): StandardValidatorFn[];
}
