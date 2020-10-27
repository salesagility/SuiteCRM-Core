<?php

namespace App\Service;

use App\Legacy\AppListStringsProviderInterface;

class LineActionDefinitionProvider implements LineActionDefinitionProviderInterface
{
    /**
     * @var array
     */
    private $listViewLineActions;

    /**
     * @var AclManagerInterface
     */
    private $aclManager;

    /**
     * @var FieldDefinitionsProviderInterface
     */
    private $fieldDefinitionProvider;

    /**
     * @var ModuleNameMapperInterface
     */
    protected $moduleNameMapper;

    /**
     * @var AppListStringsProviderInterface
     */
    protected $appListStringProvider;

    /**
     * @var array
     */
    protected $appListStrings = [];

    /**
     * LineActionDefinitionProvider constructor.
     * @param array $listViewLineActions
     * @param AclManagerInterface $aclManager
     * @param FieldDefinitionsProviderInterface $fieldDefinitionProvider
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param AppListStringsProviderInterface $appListStringProvider
     */
    public function __construct(
        array $listViewLineActions,
        AclManagerInterface $aclManager,
        FieldDefinitionsProviderInterface $fieldDefinitionProvider,
        ModuleNameMapperInterface $moduleNameMapper,
        AppListStringsProviderInterface $appListStringProvider
    )
    {
        $this->listViewLineActions = $listViewLineActions;
        $this->aclManager = $aclManager;
        $this->fieldDefinitionProvider = $fieldDefinitionProvider;
        $this->moduleNameMapper = $moduleNameMapper;
        $this->appListStringProvider = $appListStringProvider;
    }

    /**
     * @inheritDoc
     */
    public function getLineActions(string $module): array
    {
        $appListStringsObject = $this->appListStringProvider->getAppListStrings('en_us');
        if ($appListStringsObject !== null) {
            $this->appListStrings = $appListStringsObject->getItems();
        }

        $defaults = $this->listViewLineActions['default'] ?? [];
        $defaultActions = $defaults['actions'] ?? [];

        $createActions = $defaultActions['create'] ?? [];
        $filteredCreateActions = $this->filterCreateActions($module, $createActions);

        $filterActions = [];

        $filterActions = array_merge($filterActions, $filteredCreateActions);

        return $filterActions;
    }

    /**
     * @param string $module
     * @param array $actionDefinition
     * @return array
     */
    protected function filterCreateActions(string $module, array $actionDefinition): array
    {
        $relatedModules = $actionDefinition['related_modules'] ?? [];
        $actionTemplate = $actionDefinition;
        unset($actionTemplate['related_modules']);
        $createActions = [];
        foreach ($relatedModules as $relatedModuleDef) {
            $relatedModuleName = $relatedModuleDef['module'];
            $relatedModuleDef['mapping'] = $this->parentFieldMapping($module, $relatedModuleName);
            $relatedModuleDef['legacyModuleName'] = $this->moduleNameMapper->toLegacy($module);
            $relatedModuleDef['action'] = $relatedModuleDef['action'] ?? 'edit';
            if (!count($relatedModuleDef['mapping'])) {
                continue;
            }
            if ($this->checkAccess($relatedModuleName, $actionDefinition['acl']) === false) {
                continue;
            }
            $createActions[] = array_merge($actionTemplate, $relatedModuleDef);
        }
        return $createActions;
    }

    /**
     * @param string $module
     * @param string $relatedModule
     * @return array
     */
    protected function parentFieldMapping(string $module, string $relatedModule): array
    {
        $vardefs = $this->fieldDefinitionProvider->getVardef($relatedModule)->getVardef();
        $vardefModuleName = $this->moduleNameMapper->toLegacy($module);
        foreach ($vardefs as $vardef) {
            $type = $vardef['type'] ?? '';
            $typeName = $vardef['type_name'] ?? '';
            if ($type !== 'parent_type' && $typeName !== 'parent_type') {
                continue;
            }
            $options = $vardef['options'] ?? '';
            $allowedParentModules = $this->appListStrings[$options] ?? [];
            if (!array_key_exists($vardefModuleName, $allowedParentModules)) {
                continue;
            }
            return [
                'moduleName' => 'parent_type',
                'name' => 'parent_name',
                'id' => 'parent_id',
            ];
        }
        return [];
    }

    /**
     * Check access
     *
     * @param string $module
     * @param array $aclList
     * @return bool
     */
    public function checkAccess(string $module, array $aclList): bool
    {
        if (empty($aclList)) {
            return true;
        }

        foreach ($aclList as $acl) {
            if ($this->aclManager->checkAccess($module, $acl, true) === false) {
                return false;
            }
        }

        return true;
    }
}
