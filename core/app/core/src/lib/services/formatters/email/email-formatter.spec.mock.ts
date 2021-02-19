import {EmailFormatter} from '../../../services/formatters/email/email-formatter.service';
import {FormControlUtils} from '../../../services/record/field/form-control.utils';

export const emailFormatterMock = new EmailFormatter(new FormControlUtils());
