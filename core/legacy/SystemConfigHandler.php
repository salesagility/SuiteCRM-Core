<?php


namespace SuiteCRM\Core\Legacy;


use ApiPlatform\Core\Exception\ItemNotFoundException;
use App\Entity\SystemConfig;

class SystemConfigHandler extends LegacyHandler
{
    protected const MSG_CONFIG_NOT_FOUND = 'Not able to find config key: ';
    /**
     * @var array
     */
    protected $exposedSystemConfigs = [];

    /**
     * SystemConfigHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param array $exposedSystemConfigs
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        array $exposedSystemConfigs
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName);
        $this->exposedSystemConfigs = $exposedSystemConfigs;
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
            if (!empty($config)) {
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
}