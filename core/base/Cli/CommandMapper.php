<?php

namespace SuiteCRM\Core\Base\Cli;

use SuiteCRM\Core\Base\Helper\File\File;
use SuiteCRM\Core\Base\Config\Manager as ConfigManager;
use SuiteCRM\Core\Base\Module\Manager as ModuleManager;

/**
 * Class CommandMapper
 * @package SuiteCRM\Core\Base\Cli
 */
class CommandMapper
{

    /**
     *
     * @var File
     */
    protected $fileHelper;

    /**
     *
     * @var array
     */
    protected $configParameters;

    /**
     *
     * @var array
     */
    protected $enabledModules;

    /**
     * CommandMapper constructor.
     * @param File $file
     * @param ConfigManager $config
     * @param $config_path
     */
    public function __construct(File $file, ConfigManager $config, $config_path)
    {
        $this->fileHelper = $file;

        try {
            $this->configParameters = $config->loadFiles($config_path);
        } catch (\Exception $e) {
            trigger_error('Config failed to load files: ' . $e);
        }

        $this->enabledModules = $this->configParameters->get('modules.enabled');
    }

    public function getAllModules(): void
    {
        $modules = (new ModuleManager($this->configParameters, $this->fileHelper))->getAllModules();

        $this->enabledModules = $modules;
    }

    /**
     * @return array
     */
    public function getAllCommands(): array
    {
        $commandClasses = [];

        $filePaths = [];

        if (empty($this->enabledModules)) {
            $this->getAllModules();
        }

        if (!empty($this->enabledModules)) {
            foreach ($this->enabledModules as $module) {
                $filePaths[] = APP_PATH . '/' . $module . '/Cli';
            }
        }

        $files = $this->fileHelper->findFiles($filePaths, '/Command.php$/');

        if (!empty($files)) {
            foreach ($files as $file) {
                $parts = explode('/', $file);

                $key = array_search('modules', $parts, true);

                $parts = array_splice($parts, ($key + 1), count($parts));

                $filename = end($parts);
                $classname = rtrim($filename, '.php');

                $keys = array_keys($parts);
                $key = end($keys);

                $parts[$key] = $classname;

                $commandClass = 'SuiteCRM\\Core\\Modules\\' . implode('\\', $parts);

                $commandClasses[] = new $commandClass($this->configParameters);
            }
        }

        return $commandClasses;
    }

}
