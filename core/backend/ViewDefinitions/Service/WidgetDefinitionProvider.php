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


namespace App\ViewDefinitions\Service;

use App\Engine\Service\ActionAvailabilityChecker\ActionAvailabilityChecker;
use App\Engine\Service\DefinitionEntryHandlingTrait;

/**
 * Class SidebarWidgetDefinitionProvider
 * @package App\Service
 */
class WidgetDefinitionProvider implements WidgetDefinitionProviderInterface
{
    use DefinitionEntryHandlingTrait;

    /**
     * @var ActionAvailabilityChecker
     */
    protected $actionChecker;

    /**
     * SidebarWidgetDefinitionProvider constructor.
     * @param ActionAvailabilityChecker $actionChecker
     */
    public function __construct(ActionAvailabilityChecker $actionChecker)
    {
        $this->actionChecker = $actionChecker;
    }

    /**
     * @inheritDoc
     */
    public function getTopWidgets(array $config, string $module, array $moduleDefaults = []): array
    {
        $widget = $config['modules'][$module]['widget'] ?? $moduleDefaults['widget'] ?? $config['default']['widget'] ?? [];
        $widget['refreshOn'] = $widget['refreshOn'] ?? 'data-update';

        return $widget;
    }

    /**
     * @inheritDoc
     */
    public function getSidebarWidgets(array $config, string $module, array $moduleDefaults = []): array
    {
        return $this->parseEntries($config, $module, $moduleDefaults);
    }

    /**
     * @param array $config
     * @param string $module
     * @param array $moduleDefaults
     * @return array
     */
    protected function parseEntries(array $config, string $module, array $moduleDefaults): array
    {
        $config['modules'][$module] = $config['modules'][$module] ?? [];
        $config['modules'][$module]['widgets'] = $config['modules'][$module]['widgets'] ?? [];

        $config['modules'][$module]['widgets'] = array_merge(
            $moduleDefaults['widgets'] ?? [],
            $config['modules'][$module]['widgets'] ?? []
        );

        foreach ($config['modules'][$module]['widgets'] as $index => $widget) {
            $config['modules'][$module]['widgets'][$index]['availability'] = $widget['availability'] ?? [];
        }

        $widgets = $this->filterDefinitionEntries($module, 'widgets', $config, $this->actionChecker);

        foreach ($widgets as $index => $widget) {
            $widgets[$index]['refreshOn'] = $widget['refreshOn'] ?? 'data-update';
        }

        return array_values($widgets);
    }
}
