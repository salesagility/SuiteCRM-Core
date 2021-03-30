<?php

namespace SuiteCRM\Core\Base\Module;

use SuiteCRM\Core\Base\Helper\File\File;
use SuiteCRM\Core\Base\Helper\Data\CollectionInterface;


/**
 * Class Manager
 * @package SuiteCRM\Core\Base\Module
 */
class Manager
{
    /**
     *
     * @var CollectionInterface
     */
    protected $config;

    /**
     *
     * @var File
     */
    protected $fileHelper;

    /**
     * Object Setup
     *
     * @param CollectionInterface $config
     * @param File $file_helper
     */
    public function __construct(CollectionInterface $config, File $file_helper)
    {
        $this->config = $config;
        $this->fileHelper = $file_helper;
    }

    /**
     * Get Module Paths
     *
     * @return array
     */
    public function getModulePaths(): array
    {
        // Get config module paths if set

        if (!$this->config->isEmpty('modules.paths')) {
            $modulePaths = [];
            $configModulePaths = $this->config->get('modules.paths');

            foreach ($configModulePaths as $modulePath) {
                $modulePaths[] = realpath(__DIR__ . $modulePath);
            }

            return $modulePaths;
        }

        // Return default module paths
        return [
            realpath(BASE_PATH . '/core/modules')
        ];
    }

    /**
     * Get an array of all modules
     *
     * @return array
     */
    public function getAllModules(): array
    {
        $modulePaths = $this->getModulePaths();

        return (new ModuleMapper($modulePaths, $this->fileHelper, $this->config))->getAllModuleFolders();
    }

    /**
     * Get a list of the enabled modules
     *
     * @return array
     */
    public function listEnabled(): array
    {
        $modulePaths = $this->getModulePaths();
        $moduleMapper = new ModuleMapper($modulePaths, $this->fileHelper, $this->config);
        $modules = [];

        if ($this->config->has('modules.enabled')) {
            $foundModules = [];

            $enabledModules = $this->config->get('modules.enabled');
            $modules = $moduleMapper->checkModulesExist($enabledModules);

            return $moduleMapper->getModuleClassesFromFileName($modules);
        }

        $moduleNames = $this->getAllModules();
        $modules = $moduleMapper->checkModulesExist($moduleNames);

        return $moduleMapper->getModuleClassesFromFileName($modules);
    }

    /**
     * Get Module Services
     *
     * @return array
     */
    public function getModuleServices(): ?array
    {
        $modules = $this->getEnabled();

        $moduleServices = [];

        foreach ($modules as $module) {
            $moduleServices[] = $module->getServices;
        }
    }

    /**
     * Get Module Command
     *
     * @return array
     */
    public function getModuleCommands(): ?array
    {
        $modules = $this->getEnabled();

        $moduleCommands = [];

        foreach ($modules as $module) {
            //$moduleCommands
        }
    }
}
