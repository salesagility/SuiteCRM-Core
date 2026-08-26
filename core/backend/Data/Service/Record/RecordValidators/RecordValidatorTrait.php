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

namespace App\Data\Service\Record\RecordValidators;

trait RecordValidatorTrait
{
    /**
     * @param array $parentMap
     * @param int $order
     * @param RecordValidatorInterface $validator
     * @return void
     */
    protected function addValidatorByOrder(array &$parentMap, int $order, RecordValidatorInterface $validator): void
    {
        $parentMap[$order][] = $validator;
    }

    /**
     * @param array $registry
     * @param string $module
     * @return RecordValidatorInterface[]
     */
    protected function getOrderedValidators(array &$registry, string $module): array
    {
        $defaultValidators = $registry['default'] ?? [];
        $moduleValidators = $registry[$module] ?? [];
        $merged = array_merge($defaultValidators, $moduleValidators);

        $flatList = [];
        foreach ($merged as $orderedValidators) {
            if (empty($orderedValidators)) {
                continue;
            }

            if (!is_array($orderedValidators)) {
                $flatList[] = $orderedValidators;
                continue;
            }

            foreach ($orderedValidators as $validator) {
                if (empty($validator)) {
                    continue;
                }
                $flatList[] = $validator;
            }
        }

        return $flatList;
    }

    /**
     * @param RecordValidatorInterface[] $validators
     * @param string $mode
     * @return RecordValidatorInterface[]
     */
    protected function filterByModes(array $validators, string $mode): array
    {
        if (empty($mode)) {
            return $validators;
        }

        $filtered = [];
        foreach ($validators as $validator) {
            if ($this->isModeMatch($validator->getModes(), $mode)) {
                $filtered[] = $validator;
            }
        }

        return $filtered;
    }

    /**
     * Check if a validator's declared modes match the current mode.
     * 'save' matches both 'create' and 'edit'.
     *
     * @param string[] $validatorModes
     * @param string $currentMode
     * @return bool
     */
    protected function isModeMatch(array $validatorModes, string $currentMode): bool
    {
        if (in_array($currentMode, $validatorModes, true)) {
            return true;
        }

        if (in_array('save', $validatorModes, true) && in_array($currentMode, ['create', 'edit'], true)) {
            return true;
        }

        return false;
    }
}
