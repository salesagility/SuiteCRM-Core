<?php

namespace SuiteCRM\Core\Base\Module;

use SuiteCRM\Core\Base\Helper\File\File;
use SuiteCRM\Core\Base\Config\ParameterCollection;

/**
 * Class ModuleMapper
 * @package SuiteCRM\Core\Base\Module
 */
class ModuleMapper
{
    /**
     *
     * @var array
     */
    protected $filePaths;

    /**
     *
     * @var File
     */
    protected $fileHelper;

    /**
     *
     * @var array
     */
    protected $moduleConfigParameters;

    /**
     *
     * @var array
     */
    protected $enabledModules;


    /**
     * Setup Object
     *
     * @param $file_paths
     * @param File $file
     * @param ParameterCollection $module_config_params
     */
    public function __construct($file_paths, File $file, ParameterCollection $module_config_params)
    {
        $this->filePaths = $file_paths;
        $this->fileHelper = $file;
        $this->moduleConfigParameters = $module_config_params;
        $this->enabledModules = $this->moduleConfigParameters->get('modules.enabled');
    }


    /**
     * Get All Module Folders
     *
     * @return array
     */
    public function getAllModuleFolders(): array
    {
        return $this->fileHelper->findDirectories($this->filePaths);
    }


    /**
     * Check modules exist out of an array input modules
     *
     * @param array $modules array of module names to check
     * @return array List if found modules
     */
    public function checkModulesExist($modules): array
    {
        $foundModules = [];

        if (!empty($modules)) {
            foreach ($modules as $module) {
                foreach ($this->filePaths as $path) {
                    if (file_exists($path . '/' . $module . '/' . $module . '.php')) {
                        $foundModules[] = $path . '/' . $module . '/' . $module . '.php';
                    }
                }
            }
        }

        return $foundModules;
    }

    /**
     * Get all module classes from file name
     *
     * @param $files
     * @return array|bool
     */
    public function getModuleClassesFromFileName($files)
    {
        if (empty($files)) {
            return false;
        }

        $moduleClasses = [];

        foreach ($files as $file) {
            $file = str_replace('suitecrm/', '', $file);
            $parts = explode('/', $file);
            $parts = array_splice($parts, 4, count($parts));

            $filename = end($parts);
            $classname = rtrim($filename, '.php');

            $keys = array_keys($parts);
            $key = end($keys);

            $parts[$key] = $classname;

            $parts = array_map('ucfirst', $parts);

            $commandClass = 'SuiteCRM\\' . implode('\\', $parts);

            $moduleClasses[] = new $commandClass();
        }

        return $moduleClasses;
    }

}
