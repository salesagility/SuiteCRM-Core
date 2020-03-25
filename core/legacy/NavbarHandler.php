<?php

namespace SuiteCRM\Core\Legacy;

use App\Entity\Navbar;
use App\Service\ModuleNameMapper;
use App\Service\RouteConverter;
use SugarView;
use TabController;
use GroupedTabStructure;
use TabGroupHelper;

/**
 * Class NavbarHandler
 */
class NavbarHandler extends LegacyHandler
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

        $navbar = new Navbar();

        $sugarView = new SugarView();

        $legacyTabNames = $this->fetchNavTabs();
        $nameMap = $this->createFrontendNameMap($legacyTabNames);

        $navbar->tabs = array_values($nameMap);
        $navbar->groupedTabs = $this->fetchGroupedNavTabs($nameMap);
        $navbar->modules = $this->buildModuleInfo($sugarView, $nameMap);
        $navbar->userActionMenu = $this->fetchUserActionMenu();

        $this->close();

        return $navbar;
    }

    /**
     * Fetch module navigation tabs
     * @return array
     */
    protected function fetchNavTabs(): array
    {
        require_once 'modules/MySettings/TabController.php';

        return (new TabController())->get_user_tabs($GLOBALS['current_user']);
    }

    /**
     * Fetch Grouped Navigation tabs
     * @param array $nameMap
     * @return array
     */
    protected function fetchGroupedNavTabs(array &$nameMap): array
    {
        $output = [];
        global $current_language;

        require_once 'include/GroupedTabs/GroupedTabStructure.php';
        require_once 'modules/Studio/TabGroups/TabGroupHelper.php';

        $tg = new TabGroupHelper();

        $availableModules = $tg->getAvailableModules($current_language);
        $modList = array_keys($availableModules);
        $modList = array_combine($modList, $modList);
        $groupedTabStructure = (new GroupedTabStructure())->get_tab_structure($modList, '', true, true);

        $moduleNameMap = $this->createFrontendNameMap($modList);

        foreach ($groupedTabStructure as $mainTab => $subModules) {
            $submoduleArray = [];

            foreach ($subModules['modules'] as $submodule => $submoduleLabel) {
                $submoduleArray[] = $moduleNameMap[$submodule];

                //Add missing module to the module info list
                if (empty($nameMap[$submodule])){
                    $nameMap[$submodule] = $moduleNameMap[$submodule];
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
     * Fetch the user action menu
     */
    protected function fetchUserActionMenu(): array
    {
        $userActionMenu = [];
        $global_control_links = [];

        $userActionMenu[] = [
            'name' => 'profile',
            'labelKey' => 'LBL_PROFILE',
            'url' => 'index.php?module=Users&action=EditView&record=1',
            'icon' => '',
        ];

        require 'include/globalControlLinks.php';

        $actionLabelMap = [
            'LBL_EMPLOYEES' => 'employees',
            'LBL_TRAINING' => 'training',
            'LNK_ABOUT' => 'about',
            'LBL_LOGOUT' => 'logout'
        ];


        foreach ($global_control_links as $key => $value) {
            foreach ($value as $linkAttribute => $attributeValue) {
                // get the main link info
                if ($linkAttribute === 'linkinfo') {
                    $userActionMenu[] = [
                        'name' => $actionLabelMap[key($attributeValue)],
                        'labelKey' => key($attributeValue),
                        'url' => current($attributeValue),
                        'icon' => '',
                    ];
                }
            }
        }

        $item = $userActionMenu[3];
        unset($userActionMenu[3]);
        $userActionMenu[] = $item;

        return array_values($userActionMenu);
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
