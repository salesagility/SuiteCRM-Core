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

namespace App\FieldDefinitions\LegacyHandler;

use App\Engine\LegacyHandler\LegacyScopeState;
use App\FieldDefinitions\Entity\FieldDefinition;
use App\Engine\LegacyHandler\LegacyHandler;
use App\FieldDefinitions\Service\FieldDefinitionsProviderInterface;
use App\Module\Service\ModuleNameMapperInterface;
use Exception;
use SugarView;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Class FieldDefinitionsHandler
 * @package App\Legacy
 */
class FieldDefinitionsHandler extends LegacyHandler implements FieldDefinitionsProviderInterface
{
    public const HANDLER_KEY = 'field-definitions';

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * @var FieldDefinitionMappers
     */
    private $mappers;

    /**
     * SystemConfigHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param FieldDefinitionMappers $mappers
     * @param SessionInterface $session
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        ModuleNameMapperInterface $moduleNameMapper,
        FieldDefinitionMappers $mappers,
        SessionInterface $session
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState,
            $session);
        $this->moduleNameMapper = $moduleNameMapper;
        $this->mappers = $mappers;
    }

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }

    /**
     * @param string $moduleName
     * @return FieldDefinition
     * @throws Exception
     */
    public function getVardef(string $moduleName): FieldDefinition
    {
        $this->init();

        $legacyModuleName = $this->moduleNameMapper->toLegacy($moduleName);

        $vardefs = new FieldDefinition();
        $vardefs->setId($moduleName);
        $vardefs->setVardef($this->getDefinitions($legacyModuleName));

        $mappers = $this->mappers->get($moduleName);

        foreach ($mappers as $mapper) {
            $mapper->map($vardefs);
        }

        $this->close();

        return $vardefs;
    }

    /**
     * Get legacy definitions
     * @param string $legacyModuleName
     * @return array|mixed
     */
    protected function getDefinitions(string $legacyModuleName)
    {
        $sugarView = new SugarView();
        $data = $sugarView->getVardefsData($legacyModuleName);

        return $data[0][$legacyModuleName] ?? [];
    }
}
