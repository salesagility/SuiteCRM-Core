<?php

namespace App\Legacy;

use ControllerFactory;
use RuntimeException;
use SugarApplication;
use SugarController;
use SugarThemeRegistry;

/**
 * Class LegacyHandler
 */
abstract class LegacyHandler
{
    protected const MSG_LEGACY_BOOTSTRAP_FAILED = 'Running legacy entry point failed';

    /**
     * @var string
     */
    protected $projectDir;

    /**
     * @var string
     */
    protected $legacyDir;

    /**
     * @var string
     */
    protected $legacySessionName;

    /**
     * @var string
     */
    protected $defaultSessionName;

    /**
     * @var LegacyScopeState
     */
    protected $state;

    /**
     * LegacyHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState
    ) {
        $this->projectDir = $projectDir;
        $this->legacyDir = $legacyDir;
        $this->legacySessionName = $legacySessionName;
        $this->defaultSessionName = $defaultSessionName;
        $this->state = $legacyScopeState;
    }

    /**
     * Legacy handler initialization method
     */
    public function init(): void
    {
        if (!empty($this->state->getActiveScope())) {
            return;
        }

        // Set working directory for legacy
        chdir($this->legacyDir);

        if (!$this->runLegacyEntryPoint()) {
            throw new RuntimeException(self::MSG_LEGACY_BOOTSTRAP_FAILED);
        }

        $this->switchSession($this->legacySessionName);

        $this->state->setActiveScope($this->getHandlerKey());
    }

    /**
     * Bootstraps legacy suite
     * @return bool
     */
    public function runLegacyEntryPoint(): bool
    {
        if ($this->state->isLegacyBootstrapped()) {
            return true;
        }

        // Set up sugarEntry
        if (!defined('sugarEntry')) {
            define('sugarEntry', true);
        }

        // Load in legacy
        /* @noinspection PhpIncludeInspection */
        require_once 'include/MVC/preDispatch.php';
        /* @noinspection PhpIncludeInspection */
        require_once 'include/entryPoint.php';

        $this->state->setLegacyBootstrapped(true);

        return true;
    }

    /**
     * Swap symfony session with legacy suite session
     * @param string $sessionName
     * @param array $keysToSync
     */
    protected function switchSession(string $sessionName, array $keysToSync = []): void
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
     * Get handler key
     * @return string
     */
    abstract public function getHandlerKey(): string;

    /**
     * Close the legacy handler
     */
    public function close(): void
    {
        if ($this->state->getActiveScope() !== $this->getHandlerKey()) {
            return;
        }

        if (!empty($this->projectDir)) {
            chdir($this->projectDir);
        }

        $this->switchSession($this->defaultSessionName);

        $this->state->setActiveScope(null);
    }

    /**
     * Start Legacy Suite app
     * @param string $currentModule
     * @return void
     * Based on @see SugarApplication::execute
     * Not calling:
     * - insert_charset_header
     * - setupPrint
     * - checkHTTPReferer
     * - controller->execute();
     * - sugar_cleanup
     */
    protected function startLegacyApp(string $currentModule = ''): void
    {
        if ($this->state->isLegacyStarted()) {
            return;
        }

        /* @noinspection PhpIncludeInspection */
        require_once 'include/MVC/SugarApplication.php';

        global $sugar_config;

        $app = new SugarApplication();

        $GLOBALS['app'] = $app;

        if (!empty($sugar_config['default_module'])) {
            $app->default_module = $sugar_config['default_module'];
        }

        $module = $app->default_module;
        if (!empty($currentModule)) {
            $module = $currentModule;
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

        $this->state->setLegacyStarted(true);
    }

    /**
     * @param string $module
     * @param string|null $record
     */
    protected function initController(string $module, string $record = null)
    {
        global $app;

        /** @var SugarController $controller */
        $controller = $app->controller;
        $controller->module = $module;

        if ($record) {
            $controller->record = $record;
        }
        $controller->loadBean();
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
