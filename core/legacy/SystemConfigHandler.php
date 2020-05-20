<?php

namespace SuiteCRM\Core\Legacy;

use ApiPlatform\Core\Exception\ItemNotFoundException;
use App\Entity\SystemConfig;
use App\Service\ActionNameMapperInterface;
use App\Service\ModuleNameMapperInterface;
use App\Service\SystemConfigProviderInterface;

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
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

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
        ClassicViewRoutingExclusionsHandler $exclusionsManager
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState);
        $this->exposedSystemConfigs = $exposedSystemConfigs;
        $this->moduleNameMapper = $moduleNameMapper;

        $this->injectedSystemConfigs['module_name_map'] = $moduleNameMapper->getLegacyToFrontendMap();
        $this->injectedSystemConfigs['action_name_map'] = $actionNameMapper->getMap();
        $this->injectedSystemConfigs['classicview_routing_exclusions'] = $exclusionsManager->get();
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

        if ($config->getId() === 'default_module') {
            $this->mapDefaultModule($config);
        }
    }

    /**
     * Map default module config
     * @param SystemConfig $config
     */
    protected function mapDefaultModule(SystemConfig $config): void
    {
        if (empty($config->getValue())) {
            return;
        }

        $frontendName = $this->moduleNameMapper->toFrontEnd($config->getValue());
        $config->setValue($frontendName);
    }
}