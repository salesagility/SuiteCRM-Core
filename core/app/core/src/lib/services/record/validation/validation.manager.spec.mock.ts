import {ValidationManager} from './validation.manager';
import {RequiredValidator} from './validators/required.validator';
import {RangeValidator} from './validators/range.validator';
import {CurrencyValidator} from './validators/currency.validator';
import {DateValidator} from './validators/date.validator';
import {DateTimeValidator} from './validators/datetime.validator';
import {EmailValidator} from './validators/email.validator';
import {FloatValidator} from './validators/float.validator';
import {IntValidator} from './validators/int.validator';
import {PhoneValidator} from './validators/phone.validator';
import {numberFormatterMock} from '../../formatters/number/number-formatter.spec.mock';
import {dateFormatterMock} from '../../formatters/datetime/date-formatter.service.spec.mock';
import {datetimeFormatterMock} from '../../formatters/datetime/datetime-formatter.service.spec.mock';
import {phoneFormatterMock} from '../../formatters/phone/phone-formatter.spec.mock';
import {emailFormatterMock} from '../../formatters/email/email-formatter.spec.mock';
import {FormControlUtils} from '../field/form-control.utils';

export const validationManagerMock = new ValidationManager(
    new RequiredValidator(new FormControlUtils()),
    new RangeValidator(),
    new CurrencyValidator(numberFormatterMock),
    new DateValidator(dateFormatterMock, new FormControlUtils()),
    new DateTimeValidator(datetimeFormatterMock),
    new EmailValidator(emailFormatterMock),
    new FloatValidator(numberFormatterMock),
    new IntValidator(numberFormatterMock),
    new PhoneValidator(phoneFormatterMock)
);
