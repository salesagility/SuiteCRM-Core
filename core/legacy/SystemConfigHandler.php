<?php

namespace App\Legacy;

use ApiPlatform\Core\Exception\ItemNotFoundException;
use App\Entity\SystemConfig;
use App\Service\ActionNameMapperInterface;
use App\Service\ModuleNameMapperInterface;
use App\Service\SystemConfigProviderInterface;
use App\Legacy\SystemConfig\SystemConfigMappers;

class SystemConfigHandler extends LegacyHandler implements SystemConfigProviderInterface
{
    protected const MSG_CONFIG_NOT_FOUND = 'Not able to find config key: ';
    public const HANDLER_KEY = 'system-config';

    /**
     * @var array
     */
    protected $exposedSystemConfigs = [];

    /**
     * @var array
     */
    protected $injectedSystemConfigs = [];

    /**
     * @var SystemConfigMappers
     */
    private $mappers;

    /**
     * @var array
     */
    private $systemConfigKeyMap;

    /**
     * SystemConfigHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param array $exposedSystemConfigs
     * @param ActionNameMapperInterface $actionNameMapper
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param ClassicViewRoutingExclusionsHandler $exclusionsManager
     * @param SystemConfigMappers $mappers
     * @param array $systemConfigKeyMap
     * @param array $cacheResetActions
     * @param array $moduleRouting
     * @param array $navigationTabLimits
     * @param array $listViewColumnLimits
     * @param array $listViewSettingsLimits
     * @param array $listViewActionsLimits
     * @param array $recordViewActionLimits
     * @param array $uiConfigs
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        array $exposedSystemConfigs,
        ActionNameMapperInterface $actionNameMapper,
        ModuleNameMapperInterface $moduleNameMapper,
        ClassicViewRoutingExclusionsHandler $exclusionsManager,
        SystemConfigMappers $mappers,
        array $systemConfigKeyMap,
        array $cacheResetActions,
        array $moduleRouting,
        array $navigationTabLimits,
        array $listViewColumnLimits,
        array $listViewSettingsLimits,
        array $listViewActionsLimits,
        array $recordViewActionLimits,
        array $uiConfigs
    )
    {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState);
        $this->exposedSystemConfigs = $exposedSystemConfigs;

        $this->injectedSystemConfigs['module_name_map'] = $moduleNameMapper->getLegacyToFrontendMap();
        $this->injectedSystemConfigs['action_name_map'] = $actionNameMapper->getMap();
        $this->injectedSystemConfigs['classicview_routing_exclusions'] = $exclusionsManager->get();
        $this->injectedSystemConfigs['cache_reset_actions'] = $cacheResetActions;
        $this->injectedSystemConfigs['module_routing'] = $moduleRouting;
        $this->injectedSystemConfigs['navigation_tab_limits'] = $navigationTabLimits;
        $this->injectedSystemConfigs['listview_column_limits'] = $listViewColumnLimits;
        $this->injectedSystemConfigs['listview_settings_limits'] = $listViewSettingsLimits;
        $this->injectedSystemConfigs['listview_actions_limits'] = $listViewActionsLimits;
        $this->injectedSystemConfigs['recordview_actions_limits'] = $recordViewActionLimits;
        $this->injectedSystemConfigs['ui'] = $uiConfigs;
        $this->mappers = $mappers;
        $this->systemConfigKeyMap = $systemConfigKeyMap;
    }

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }

    /**
     * Get all exposed system configs
     * @return array
     */
    public function getAllSystemConfigs(): array
    {
        $this->init();

        $configs = [];

        foreach ($this->exposedSystemConfigs as $configKey => $value) {
            $config = $this->loadSystemConfig($configKey);
            $this->mapConfigValues($config);
            $this->mapKey($config);
            if ($config !== null) {
                $configs[] = $config;
            }
        }

        $this->close();

        return $configs;
    }

    /**
     * Get system config
     * @param string $configKey
     * @return SystemConfig|null
     */
    public function getSystemConfig(string $configKey): ?SystemConfig
    {
        $this->init();

        $config = $this->loadSystemConfig($configKey);

        $this->mapConfigValues($config);
        $this->mapKey($config);

        $this->close();

        return $config;
    }

    /**
     * Load system config with given $key
     * @param $configKey
     * @return SystemConfig|null
     */
    protected function loadSystemConfig(string $configKey): ?SystemConfig
    {
        global $sugar_config;

        if (empty($configKey)) {
            return null;
        }

        if (!isset($this->exposedSystemConfigs[$configKey])) {
            throw new ItemNotFoundException(self::MSG_CONFIG_NOT_FOUND . "'$configKey'");
        }

        $config = new SystemConfig();
        $config->setId($configKey);


        if (!empty($this->injectedSystemConfigs[$configKey])) {
            $config->setItems($this->injectedSystemConfigs[$configKey]);

            return $config;
        }

        if (!isset($sugar_config[$configKey])) {
            return $config;
        }

        if (is_array($sugar_config[$configKey])) {

            $items = $sugar_config[$configKey];

            if (is_array($this->exposedSystemConfigs[$configKey])) {

                $items = $this->filterItems($sugar_config[$configKey], $this->exposedSystemConfigs[$configKey]);

            }

            $config->setItems($items);

            return $config;
        }

        $config->setValue($sugar_config[$configKey]);

        return $config;
    }

    /**
     * Filter to retrieve only exposed items
     * @param array $allItems
     * @param array $exposed
     * @return array
     */
    protected function filterItems(array $allItems, array $exposed): array
    {
        $items = [];

        if (empty($exposed)) {
            return $items;
        }

        foreach ($allItems as $configKey => $configValue) {

            if (!isset($exposed[$configKey])) {
                continue;
            }

            if (is_array($allItems[$configKey])) {

                $subItems = $allItems[$configKey];

                if (is_array($exposed[$configKey])) {

                    $subItems = $this->filterItems($allItems[$configKey], $exposed[$configKey]);
                }

                $items[$configKey] = $subItems;

                continue;
            }

            $items[$configKey] = $configValue;
        }

        return $items;
    }

    /**
     * Map config values using mappers registered in the mapper registry
     * @param SystemConfig $config |null
     */
    protected function mapConfigValues(?SystemConfig $config): void
    {
        if ($config === null || empty($config->getId())) {
            return;
        }

        if ($this->mappers->hasMapper($config->getId())) {
            $mapper = $this->mappers->get($config->getId());
            $mapper->map($config);
        }
    }

    /**
     * Map config key
     * @param SystemConfig|null $config
     */
    protected function mapKey(?SystemConfig $config): void
    {
        if ($config === null || empty($config->getId())) {
            return;
        }

        if (isset($this->systemConfigKeyMap[$config->getId()])) {
            $config->setId($this->systemConfigKeyMap[$config->getId()]);
        }
    }
}
