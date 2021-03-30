<?php

namespace SuiteCRM\Core\Legacy;

use DoctrineTest\InstantiatorTestAsset\ExceptionAsset;

/**
 * Class LegacyHandler
 * @package SuiteCRM\Core\Legacy
 */
class LegacyHandler
{
    protected $config;

    /**
     * @return bool
     */
    public function runLegacyEntryPoint(): bool
    {
        if ($this->config !== null) {
            // Set up sugarEntry
            if (!defined('sugarEntry')) {
                define('sugarEntry', true);
            }

            // Set working directory for legacy
            chdir(BASE_PATH . '/legacy');

            // Load in legacy
            require_once 'include/MVC/preDispatch.php';
            require_once 'include/entryPoint.php';

            return true;
        }

        return false;
    }
}
