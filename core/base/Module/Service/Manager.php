<?php

namespace SuiteCRM\Core\Base\Module\Service;

use SuiteCRM\Core\Base\Module\Manager as ModuleManager;
use SuiteCRM\Core\Base\Module\Service\ServiceCollection;

use Symfony\Component\Config\FileLocator;

/**
 * Class Manager
 * @package SuiteCRM\Core\Base\Module\Service
 */
class Manager
{
    protected $serviceList = [];

    /**
     * Manager constructor.
     * @param ModuleManager $moduleManager
     */
    public function __construct(ModuleManager $moduleManager)
    {
        foreach ($moduleManager->listEnabled() as $module) {
            $file = new FileLocator();

            $service = new $module();
        }

        return (new ServiceCollection())->load();
    }


}
