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
        if (!defined('LEGACY_PATH')) {
            define('LEGACY_PATH', dirname(__DIR__, 2) . '/legacy/');
        }

        // Set up sugarEntry
        if (!defined('sugarEntry')) {
            define('sugarEntry', true);
        }

        // Set working directory for legacy
        chdir(LEGACY_PATH);

        // Load in legacy
        require_once LEGACY_PATH . 'include/MVC/preDispatch.php';
        require_once LEGACY_PATH . 'include/entryPoint.php';

        return true;
    }
}
