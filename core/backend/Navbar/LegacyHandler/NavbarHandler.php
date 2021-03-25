<?php

namespace App\Navbar\LegacyHandler;

use App\Engine\LegacyHandler\LegacyScopeState;
use App\Entity\Navbar;
use App\Engine\LegacyHandler\LegacyHandler;
use App\Service\ModuleNameMapperInterface;
use App\Service\ModuleRegistryInterface;
use App\Service\NavigationProviderInterface;
use App\Service\RouteConverterInterface;
use GroupedTabStructure;
use SugarView;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Class NavbarHandler
 */
class NavbarHandler extends LegacyHandler implements NavigationProviderInterface
{
    public const HANDLER_KEY = 'navbar-handler';
    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * @var RouteConverterInterface
     */
    private $routeConverter;

    /**
     * @var array
     */
    private $menuItemMap;

    /**
     * @var ModuleRegistryInterface
     */
    private $moduleRegistry;

    /**
     * SystemConfigHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param array $menuItemMap
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param RouteConverterInterface $routeConverter
     * @param ModuleRegistryInterface $moduleRegistry
     * @param SessionInterface $session
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        array $menuItemMap,
        ModuleNameMapperInterface $moduleNameMapper,
        RouteConverterInterface $routeConverter,
        ModuleRegistryInterface $moduleRegistry,
        SessionInterface $session
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState, $session);
        $this->moduleNameMapper = $moduleNameMapper;
        $this->routeConverter = $routeConverter;
        $this->menuItemMap = $menuItemMap;
        $this->moduleRegistry = $moduleRegistry;
    }

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }

    /**
     * Get Navbar using legacy information
     * @return Navbar
     */
    public function getNavbar(): Navbar
    {
        $this->init();

        $this->disableTranslations();

        $this->startLegacyApp();

        $navbar = new Navbar();
        $sugarView = new SugarView();

        $accessibleModules = $this->getAccessibleModulesList();
        $accessibleModulesNameMap = $this->createFrontendNameMap($accessibleModules);
        $displayModules = $this->getDisplayEnabledModules();
        $displayModulesMameMap = array_intersect_key($accessibleModulesNameMap, array_flip($displayModules));

        $navbar->tabs = array_values($displayModulesMameMap);
        $navbar->groupedTabs = $this->fetchGroupedNavTabs($displayModules, $displayModulesMameMap);

        $navbar->modules = $this->buildModuleInfo($sugarView, $accessibleModulesNameMap);

        $navbar->userActionMenu = $this->fetchUserActionMenu();
        $navbar->maxTabs = $this->getMaxTabs();

        $this->close();

        return $navbar;
    }

    /**
     * Get list of modules the user has access to
     * @return array
     */
    protected function getAccessibleModulesList(): array
    {
        return $this->moduleRegistry->getUserAccessibleModules();
    }

    /**
     * Map legacy names to front end names
     * @param array $legacyTabNames
     * @return array
     */
    protected function createFrontendNameMap(array $legacyTabNames): array
    {
        $map = [];

        foreach ($legacyTabNames as $legacyTabName) {
            $map[$legacyTabName] = $this->moduleNameMapper->toFrontEnd($legacyTabName);
        }

        return $map;
    }

    /**
     * Fetch modules that are configured to display
     * @return array
     * Based on @see SugarView::displayHeader
     */
    protected function getDisplayEnabledModules(): array
    {
        global $current_user;

        return query_module_access_list($current_user);
    }

    /**
     * Fetch Grouped Navigation tabs
     * @param array $displayModules
     * @param array $moduleNameMap
     * @return array
     * Based on @see SugarView::displayHeader
     */
    protected function fetchGroupedNavTabs(array $displayModules, array $moduleNameMap): array
    {
        $output = [];

        /* @noinspection PhpIncludeInspection */
        require_once 'include/GroupedTabs/GroupedTabStructure.php';

        $modules = get_val_array($displayModules);
        $groupedTabStructure = $this->getTabStructure($modules);

        foreach ($groupedTabStructure as $mainTab => $subModules) {
            $submoduleArray = [];

            foreach ($subModules['modules'] as $submodule => $submoduleLabel) {
                if (!empty($moduleNameMap[$submodule])) {
                    $submoduleArray[] = $moduleNameMap[$submodule];
                }
            }

            $output[] = [

                'name' => $mainTab,
                'labelKey' => $mainTab,
                'modules' => array_values($submoduleArray)

            ];
        }

        return $output;
    }

    /**
     * Get Tab Structure
     * @param array $modules
     * @return array
     */
    protected function getTabStructure(array $modules): array
    {
        return (new GroupedTabStructure())->get_tab_structure($modules, '', false, true);
    }

    /**
     * @param SugarView $sugarView
     * @param array $legacyNameMap
     * @return array
     */
    protected function buildModuleInfo(SugarView $sugarView, array $legacyNameMap): array
    {
        $modules = [];

        foreach ($legacyNameMap as $legacyName => $frontendName) {
            $menu = $this->buildSubModule($sugarView, $legacyName, $frontendName);
            $modules[$frontendName] = [
                'path' => $frontendName,
                'defaultRoute' => "./#/$frontendName",
                'name' => $frontendName,
                'labelKey' => $legacyName,
                'menu' => $menu
            ];
        }

        return $modules;
    }

    /**
     * Retrieve legacy menu information and build suite 8 entry
     * @param SugarView $sugarView
     * @param string $legacyModule
     * @param string $frontendModule
     * @return array
     */
    protected function buildSubModule(SugarView $sugarView, string $legacyModule, string $frontendModule): array
    {
        $subMenu = [];
        $legacyMenuItems = $sugarView->getMenu($legacyModule);

        foreach ($legacyMenuItems as $legacyMenuItem) {

            [$url, $label, $action] = $legacyMenuItem;

            $routeInfo = $this->routeConverter->parseUri($url);

            $subMenuItem = [
                'name' => $action,
                'labelKey' => $this->mapEntry($frontendModule, $action, 'labelKey', $label),
                'url' => $this->mapEntry($frontendModule, $action, 'url', $routeInfo['route']),
                'params' => $routeInfo['params'],
                'icon' => $this->mapEntry($frontendModule, $action, 'icon', ''),
                'actionLabelKey' => $this->mapEntry($frontendModule, $action, 'actionLabelKey', '')
            ];

            if (!empty($routeInfo['module'])) {
                $subMenuItem['module'] = $this->moduleNameMapper->toFrontEnd($routeInfo['module']);
            }

            $subMenu[] = $subMenuItem;
        }

        return $subMenu;
    }

    /**
     * Map entry if defined on the configuration
     * @param string $moduleName
     * @param string $action
     * @param string $entry
     * @param string $default
     * @return string
     */
    protected function mapEntry(string $moduleName, string $action, string $entry, string $default): string
    {
        $module = $moduleName;
        if ($this->isEntryMapped($action, $entry, $module)) {
            $module = 'default';
        }

        if ($this->isEntryMapped($action, $entry, $module)) {
            return $default;
        }

        return $this->menuItemMap[$module][$action][$entry];
    }

    /**
     * Check if there is an entry mapped for the given module
     * @param string $action
     * @param string $entry
     * @param string $module
     * @return bool
     */
    protected function isEntryMapped(string $action, string $entry, string $module): bool
    {
        return empty($this->menuItemMap[$module]) ||
            empty($this->menuItemMap[$module][$action]) ||
            empty($this->menuItemMap[$module][$action][$entry]);
    }

    /**
     * Fetch the user action menu
     */
    protected function fetchUserActionMenu(): array
    {
        global $current_user;

        $actions['LBL_PROFILE'] = [
            'name' => 'profile',
            'labelKey' => 'LBL_PROFILE',
            'url' => 'index.php?module=Users&action=EditView&record=' . $current_user->id,
            'icon' => '',
        ];

        // Order matters
        $actionLabelMap = [
            'LBL_PROFILE' => 'profile',
            'LBL_EMPLOYEES' => 'employees',
            'LBL_TRAINING' => 'training',
            'LBL_ADMIN' => 'admin',
            'LNK_ABOUT' => 'about',
            'LBL_LOGOUT' => 'logout',
        ];

        $actionKeys = array_keys($actionLabelMap);

        foreach ($this->getGlobalControlLinks() as $key => $value) {
            foreach ($value as $linkAttribute => $attributeValue) {
                // get the main link info
                if ($linkAttribute === 'linkinfo') {

                    $labelKey = key($attributeValue);
                    $name = $labelKey;
                    if (!empty($actionLabelMap[$labelKey])) {
                        $name = $actionLabelMap[$labelKey];
                    } else {
                        $actionKeys[] = $labelKey;
                    }

                    $actions[$labelKey] = [
                        'name' => $name,
                        'labelKey' => $labelKey,
                        'url' => current($attributeValue),
                        'icon' => '',
                    ];
                }
            }
        }

        $userActionMenu = [];

        foreach ($actionKeys as $key) {
            if (isset($actions[$key])) {
                $userActionMenu[] = $actions[$key];
            }
        }

        return array_values($userActionMenu);
    }

    /**
     * Get global control links from legacy
     * @return array
     */
    protected function getGlobalControlLinks(): array
    {
        $global_control_links = [];

        /* @noinspection PhpIncludeInspection */
        require 'include/globalControlLinks.php';

        return $global_control_links;
    }

    /**
     * Get max number of tabs
     * @return int
     * Based on @link SugarView
     */
    protected function getMaxTabs(): int
    {
        global $current_user;

        $maxTabs = $current_user->getPreference('max_tabs');

        // If the max_tabs isn't set incorrectly, set it within the range, to the default max sub tabs size
        if (!isset($maxTabs) || $maxTabs <= 0 || $maxTabs > 10) {
            // We have a default value. Use it
            if (isset($GLOBALS['sugar_config']['default_max_tabs'])) {
                $maxTabs = $GLOBALS['sugar_config']['default_max_tabs'];
            } else {
                $maxTabs = 8;
            }
        }

        return $maxTabs;
    }
}
