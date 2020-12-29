import {ValidationManager} from '@services/record/validation/validation.manager';
import {RequiredValidator} from '@services/record/validation/validators/required.validator';
import {RangeValidator} from '@services/record/validation/validators/range.validator';
import {CurrencyValidator} from '@services/record/validation/validators/currency.validator';
import {DateValidator} from '@services/record/validation/validators/date.validator';
import {DateTimeValidator} from '@services/record/validation/validators/datetime.validator';
import {EmailValidator} from '@services/record/validation/validators/email.validator';
import {FloatValidator} from '@services/record/validation/validators/float.validator';
import {IntValidator} from '@services/record/validation/validators/int.validator';
import {PhoneValidator} from '@services/record/validation/validators/phone.validator';
import {numberFormatterMock} from '@services/formatters/number/number-formatter.spec.mock';
import {dateFormatterMock} from '@services/formatters/datetime/date-formatter.service.spec.mock';
import {datetimeFormatterMock} from '@services/formatters/datetime/datetime-formatter.service.spec.mock';
import {phoneFormatterMock} from '@services/formatters/phone/phone-formatter.spec.mock';

export const validationManagerMock = new ValidationManager(
    new RequiredValidator(),
    new RangeValidator(),
    new CurrencyValidator(numberFormatterMock),
    new DateValidator(dateFormatterMock),
    new DateTimeValidator(datetimeFormatterMock),
    new EmailValidator(),
    new FloatValidator(numberFormatterMock),
    new IntValidator(numberFormatterMock),
    new PhoneValidator(phoneFormatterMock)
);
