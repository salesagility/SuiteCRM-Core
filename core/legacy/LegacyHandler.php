<?php

namespace SuiteCRM\Core\Legacy;

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
        if (!defined('BASE_PATH')) {
            define('BASE_PATH', dirname(__DIR__, 2) . '/');
        }

        // Set up sugarEntry
        if (!defined('sugarEntry')) {
            define('sugarEntry', true);
        }

        $legacyPath = realpath(BASE_PATH . '/legacy');

        // Set working directory for legacy
        chdir($legacyPath);

        // Load in legacy
        require_once 'include/MVC/preDispatch.php';
        require_once 'include/entryPoint.php';

        return true;
    }
}
