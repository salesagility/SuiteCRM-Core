import {PhoneFormatter} from './phone-formatter.service';
import {FormControlUtils} from '../../record/field/form-control.utils';

export const phoneFormatterMock = new PhoneFormatter(new FormControlUtils());
