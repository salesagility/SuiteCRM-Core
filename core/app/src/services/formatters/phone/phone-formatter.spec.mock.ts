import {PhoneFormatter} from '@services/formatters/phone/phone-formatter.service';
import {FormControlUtils} from '@services/record/field/form-control.utils';

export const phoneFormatterMock = new PhoneFormatter(new FormControlUtils());
