<?php

namespace SuiteCRM\Core\Base\Module\Service;

use SuiteCRM\Core\Base\Helper\File\File;
use SuiteCRM\Core\Base\Module\Manager as ModuleManager;
use SuiteCRM\Core\Base\Config\ParameterCollection;

/**
 * Class ServiceMapper
 * @package SuiteCRM\Core\Base\Module\Service
 */
class ServiceMapper
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
    protected $moduleManager;

    /**
     *
     * @var array
     */
    protected $config;

    /**
     * ServiceMapper constructor.
     * @param File $file
     * @param ModuleManager $moduleManager
     * @param ParameterCollection $config
     */
    public function __construct(File $file, ModuleManager $moduleManager, ParameterCollection $config)
    {
        $this->fileHelper = $file;
        $this->moduleManager = $moduleManager;
        $this->config = $config;
    }

    /**
     * Get all services enabled in the system
     *
     * @return ServiceCollection
     */
    public function getAllServices(): ServiceCollection
    {
        $serviceClasses = [];

        $filePaths = [];

        $enabledModules = $this->moduleManager->getAllModules();

        // Get Application Service
        if (!empty($enabledModules)) {
            foreach ($enabledModules as $module) {
                $path = APP_PATH . 'Modules/' . $module . '/Service';
                if (file_exists($path)) {
                    $filePaths[] = $path;
                }
            }
        }

        $files = $this->fileHelper->findFiles($filePaths, '/Service.php$/');

        if (!empty($files)) {
            foreach ($files as $file) {
                $parts = explode('/', $file);

                $key = array_search('Modules', $parts, true);

                $parts = array_splice($parts, $key, count($parts));

                $filename = end($parts);
                $classname = rtrim($filename, '.php');

                $keys = array_keys($parts);
                $key = end($keys);

                $parts[$key] = $classname;

                $serviceClass = 'SuiteCRM\\App\\' . implode('\\', $parts);

                $service = new $serviceClass();
                $serviceName = $service->getName();

                $serviceClasses[$serviceName] = $service->createService();
            }
        }

        // Load in configuration services if they're available
        if ($this->config->has('services')) {
            foreach ($this->config->get('services') as $serviceName => $serviceFactory) {
                $serviceFactory = new $serviceFactory();
                $service = $serviceFactory->createService();
                $serviceClasses[$serviceName] = $service;
            }
        }

        return new ServiceCollection($serviceClasses);
    }
}
