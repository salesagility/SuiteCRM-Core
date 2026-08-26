<?php
/**
 * SuiteCRM is a customer relationship management program developed by SuiteCRM Ltd.
 * Copyright (C) 2026 SuiteCRM Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SUITECRM, SUITECRM DISCLAIMS THE
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

namespace App\Module\Users\Service\Record\Validators;

use App\Data\Entity\Record;
use App\Data\Service\Record\RecordValidators\RecordValidatorInterface;
use SugarBean;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class UsersSaveValidator implements RecordValidatorInterface
{
    /**
     * @inheritDoc
     */
    public function getKey(): string
    {
        return 'users-admin-only-save';
    }

    /**
     * @inheritDoc
     */
    public function getModule(): string
    {
        return 'Users';
    }

    /**
     * @inheritDoc
     */
    public function getOrder(): int
    {
        return 0;
    }

    /**
     * @inheritDoc
     */
    public function getModes(): array
    {
        return ['save'];
    }

    /**
     * @inheritDoc
     */
    public function validate(Record $record, SugarBean $bean): void
    {
        global $current_user;

        if (is_admin($current_user)) {
            return;
        }

        $isUpdate = !empty($bean->id) && empty($bean->new_with_id);
        if ($isUpdate && $bean->id === $current_user->id) {
            return;
        }

        throw new AccessDeniedHttpException('Not authorized to save user records');
    }
}
