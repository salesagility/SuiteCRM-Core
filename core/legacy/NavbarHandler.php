<?php

namespace SuiteCRM\Core\Legacy;

use App\Entity\Navbar;
use App\Service\ModuleNameMapper;
use App\Service\NavigationProviderInterface;
use App\Service\RouteConverter;
use GroupedTabStructure;
use SugarView;
use TabController;

/**
 * Class NavbarHandler
 */
class NavbarHandler extends LegacyHandler implements NavigationProviderInterface
{
    /**
     * @var ModuleNameMapper
     */
    private $moduleNameMapper;

    /**
     * @var RouteConverter
     */
    private $routeConverter;

    /**
     * @var array
     */
    private $menuItemMap;

    /**
     * SystemConfigHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param array $menuItemMap
     * @param ModuleNameMapper $moduleNameMapper
     * @param RouteConverter $routeConverter
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        array $menuItemMap,
        ModuleNameMapper $moduleNameMapper,
        RouteConverter $routeConverter
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName);
        $this->moduleNameMapper = $moduleNameMapper;
        $this->routeConverter = $routeConverter;
        $this->menuItemMap = $menuItemMap;
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

        $this->close();

        return $navbar;
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
     * Get list of modules the user has access to
     * @return array
     */
    protected function getAccessibleModulesList(): array
    {
        require_once 'modules/MySettings/TabController.php';

        return (new TabController())->get_user_tabs($GLOBALS['current_user']);
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

            sort($submoduleArray);

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
        require 'include/globalControlLinks.php';
        return $global_control_links;
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
                'defaultRoute' => "./#/$frontendName/index",
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

            $subMenu[] = [
                'name' => $action,
                'labelKey' => $this->mapEntry($frontendModule, $action, 'labelKey', $label),
                'url' => $this->mapEntry($frontendModule, $action, 'url', $routeInfo['route']),
                'params' => $routeInfo['params'],
                'icon' => $this->mapEntry($frontendModule, $action, 'icon', '')
            ];
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
}
