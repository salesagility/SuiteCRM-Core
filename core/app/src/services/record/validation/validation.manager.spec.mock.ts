/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

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
import {emailFormatterMock} from '@services/formatters/email/email-formatter.spec.mock';
import {FormControlUtils} from '@services/record/field/form-control.utils';

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
