<?php

namespace SuiteCRM\Core\Legacy;

use ControllerFactory;
use RuntimeException;
use SugarApplication;
use SugarController;
use SugarThemeRegistry;

/**
 * Class LegacyHandler
 */
class LegacyHandler
{
    protected const MSG_LEGACY_BOOTSTRAP_FAILED = 'Running legacy entry point failed';

    /**
     * @var string
     */
    protected $projectDir;

    /**
     * @var string
     */
    private $legacyDir;

    /**
     * @var string
     */
    private $legacySessionName;

    /**
     * @var string
     */
    private $defaultSessionName;

    /**
     * LegacyHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName
    ) {
        $this->projectDir = $projectDir;
        $this->legacyDir = $legacyDir;
        $this->legacySessionName = $legacySessionName;
        $this->defaultSessionName = $defaultSessionName;
    }

    /**
     * Legacy handler initialization method
     */
    public function init(): void
    {
        // Set working directory for legacy
        chdir($this->legacyDir);

        if (!$this->runLegacyEntryPoint()) {
            throw new RuntimeException(self::MSG_LEGACY_BOOTSTRAP_FAILED);
        }

        $this->switchSession($this->legacySessionName);
    }

    /**
     * Bootstraps legacy suite
     * @return bool
     */
    public function runLegacyEntryPoint(): bool
    {
        if (defined('IS_LEGACY_BOOTSTRAPPED') && IS_LEGACY_BOOTSTRAPPED) {
            return true;
        }

        // Set up sugarEntry
        if (!defined('sugarEntry')) {
            define('sugarEntry', true);
        }

        // Load in legacy
        require_once 'include/MVC/preDispatch.php';
        require_once 'include/entryPoint.php';

        define('IS_LEGACY_BOOTSTRAPPED', true);

        return true;
    }

    /**
     * Start Legacy Suite app
     * @return void
     * Based on @see SugarApplication::execute
     * Not calling:
     * - insert_charset_header
     * - setupPrint
     * - checkHTTPReferer
     * - controller->execute();
     * - sugar_cleanup
     */
    protected function startLegacyApp(): void
    {
        if (defined('LEGACY_APP_STARTED') && LEGACY_APP_STARTED) {
            return;
        }

        require_once 'include/MVC/SugarApplication.php';

        global $sugar_config;

        $app = new SugarApplication();

        if (!empty($sugar_config['default_module'])) {
            $app->default_module = $sugar_config['default_module'];
        }

        $module = $app->default_module;
        if (!empty($_REQUEST['module'])) {
            $module = $_REQUEST['module'];
        }

        /** @var SugarController $controller */
        $controller = ControllerFactory::getController($module);
        $app->controller = $controller;
        // If the entry point is defined to not need auth, then don't authenticate.
        if (empty($_REQUEST['entryPoint']) || $controller->checkEntryPointRequiresAuth($_REQUEST['entryPoint'])) {
            $app->loadUser();
            $app->ACLFilter();
            $app->preProcess();
            $controller->preProcess();
        }

        SugarThemeRegistry::buildRegistry();
        $app->loadLanguages();
        $app->loadDisplaySettings();
        $app->loadGlobals();
        $app->setupResourceManagement($module);

        define('LEGACY_APP_STARTED', true);
    }

    /**
     * Close the legacy handler
     */
    public function close(): void
    {
        if (!empty($this->projectDir)) {
            chdir($this->projectDir);
        }

        $this->switchSession($this->defaultSessionName);
    }


    /**
     * Swap symfony session with legacy suite session
     * @param string $sessionName
     * @param array $keysToSync
     */
    protected function switchSession(string $sessionName, array $keysToSync = [])
    {
        $carryOver = [];

        foreach ($keysToSync as $key) {
            if (!empty($_SESSION[$key])) {
                $carryOver[$key] = $_SESSION[$key];
            }
        }

        session_write_close();
        session_name($sessionName);

        if (!isset($_COOKIE[$sessionName])) {
            $_COOKIE[$sessionName] = session_create_id();
        }

        session_id($_COOKIE[$sessionName]);
        session_start();

        foreach ($carryOver as $key => $value) {
            $_SESSION[$key] = $value;
        }
    }

    /**
     * Disable legacy suite translations
     */
    protected function disableTranslations(): void
    {
        global $sugar_config, $app_strings;

        if (!isset($sugar_config)) {
            $sugar_config = [];
        }

        $sugar_config['disable_translations'] = true;

        $app_strings = disable_translations($app_strings);
    }
}
