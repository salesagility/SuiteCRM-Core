<?php
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


namespace App\Data\Service\Record\RecordSaveHandlers;

use Traversable;

class RecordSaveHandlerRegistry implements RecordSaveHandlerRegistryInterface
{
    /**
     * @var RecordBeforeSaveHandlerInterface[]
     */
    protected array $beforeSaveRegistry = [];

    /**
     * @var RecordAfterSaveHandlerInterface[]
     */
    protected array $afterSaveRegistry = [];

    /**
     * RecordSaveHandlerInterface constructor.
     * @param Traversable $beforeSaveHandlers
     * @param Traversable $afterSaveHandlers
     */
    public function __construct(
        Traversable $beforeSaveHandlers,
        Traversable $afterSaveHandlers
    ) {
        /**
         * @var $beforeSaveHandlers RecordBeforeSaveHandlerInterface[]
         */
        $this->registerHandlers($this->beforeSaveRegistry, $beforeSaveHandlers);
        /**
         * @var $afterSaveHandlers RecordAfterSaveHandlerInterface[]
         */
        $this->registerHandlers($this->afterSaveRegistry, $afterSaveHandlers);

    }

    /**
     * Get the before save handlers for the module key
     * @param string $module
     * @return RecordSaveHandlerInterface[]
     */
    public function getBeforeSaveHandlers(string $module): array
    {
        $defaultDefinitions = $this->beforeSaveRegistry['default'] ?? [];
        $moduleDefinitions = $this->beforeSaveRegistry[$module] ?? [];

        return array_merge($defaultDefinitions, $moduleDefinitions);
    }

    /**
     * Get the after save handlers for the module key
     * @param string $module
     * @return RecordSaveHandlerInterface[]
     */
    public function getAfterSaveHandlers(string $module): array
    {
        $defaultDefinitions = $this->afterSaveRegistry['default'] ?? [];
        $moduleDefinitions = $this->afterSaveRegistry[$module] ?? [];

        return array_merge($defaultDefinitions, $moduleDefinitions);
    }

    /**
     * @param array $registry
     * @param RecordSaveHandlerInterface[] $handlers
     * @return void
     */
    protected function registerHandlers(array &$registry, iterable $handlers): void
    {
        foreach ($handlers as $handler) {
            $key = $handler->getKey();
            $module = $handler->getModule();
            $moduleHandlers = $registry[$module] ?? [];
            $moduleHandlers[$key] = $handler;
            $registry[$module] = $moduleHandlers;
        }
    }
}
