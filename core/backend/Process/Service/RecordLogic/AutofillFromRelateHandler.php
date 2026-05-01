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

namespace App\Process\Service\RecordLogic;

use App\Data\Service\RecordProviderInterface;
use App\Module\Service\ModuleNameMapperInterface;
use App\Process\Entity\Process;
use App\Process\Service\ProcessHandlerInterface;

class AutofillFromRelateHandler implements ProcessHandlerInterface
{
    protected const PROCESS_TYPE = 'autofill-from-relate';
    protected const MSG_OPTIONS_NOT_FOUND = 'Process options are not defined';
    protected const MSG_MISSING_RELATE_MODULE = 'LBL_AUTOFILL_MISSING_RELATE_MODULE';
    protected const MSG_MISSING_RELATE_ID = 'LBL_AUTOFILL_MISSING_RELATE_ID';
    protected const MSG_MISSING_UPDATE_FIELDS = 'LBL_AUTOFILL_MISSING_UPDATE_FIELDS';

    public function __construct(
        protected RecordProviderInterface $recordProvider,
        protected ModuleNameMapperInterface $moduleNameMapper
    ) {
    }

    public function getProcessType(): string
    {
        return self::PROCESS_TYPE;
    }

    public function requiredAuthRole(): string
    {
        return 'ROLE_USER';
    }

    public function getRequiredACLs(Process $process): array
    {
        $options = $process->getOptions();
        $module = $options['module'] ?? '';

        return [
            $module => [
                ['action' => 'edit']
            ]
        ];
    }

    public function configure(Process $process): void
    {
        $process->setId(self::PROCESS_TYPE);
        $process->setAsync(false);
    }

    public function validate(Process $process): void
    {
        $options = $process->getOptions();

        if (empty($options)) {
            throw new InvalidArgumentException(self::MSG_OPTIONS_NOT_FOUND);
        }
    }

    public function run(Process $process): void
    {
        $options = $process->getOptions();
        $relateModule = $options['relateModule'] ?? '';
        $relateId = $options['relateId'] ?? '';
        $updateFields = $options['updateFields'] ?? [];

        if (empty($relateModule)) {
            $process->setStatus('error');
            $process->setMessages([self::MSG_MISSING_RELATE_MODULE]);
            return;
        }

        if (empty($relateId)) {
            $process->setStatus('error');
            $process->setMessages([self::MSG_MISSING_RELATE_ID]);
            return;
        }

        if (empty($updateFields)) {
            $process->setStatus('error');
            $process->setMessages([self::MSG_MISSING_UPDATE_FIELDS]);
            return;
        }

        $legacyModule = $this->moduleNameMapper->toLegacy($relateModule);
        $relatedRecord = $this->recordProvider->getRecord($legacyModule, $relateId);
        $relatedAttributes = $relatedRecord->getAttributes() ?? [];

        $fieldValues = [];
        foreach ($updateFields as $targetField => $config) {
            $sourceField = $config['sourceField'] ?? '';
            if (empty($sourceField)) {
                continue;
            }
            $fieldValues[$targetField] = [
                'value' => $relatedAttributes[$sourceField] ?? '',
            ];
        }

        $process->setStatus('success');
        $process->setMessages([]);
        $process->setData(['fieldValues' => $fieldValues]);
    }
}
