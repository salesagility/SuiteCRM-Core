<?php

namespace SuiteCRM\Core\Legacy;

use App\Entity\Navbar;
use TabController;
use GroupedTabStructure;
use TabGroupHelper;

/**
 * Class NavbarHandler
 */
class NavbarHandler extends LegacyHandler
{
    /**
     * Get Navbar using legacy information
     * @return Navbar
     */
    public function getNavbar(): Navbar
    {
        $this->init();

        $navbar = new Navbar();

        $navbar->NonGroupedTabs = $this->fetchNonGroupedNavTabs();
        $navbar->groupedTabs = $this->fetchGroupedNavTabs();
        $navbar->userActionMenu = $this->fetchUserActionMenu();
        $navbar->moduleSubmenus = $this->fetchModuleSubMenus();

        $this->close();

        return $navbar;
    }

    /**
     * Fetch module navigation tabs
     * @return array
     */
    protected function fetchNonGroupedNavTabs(): array
    {
        require_once 'modules/MySettings/TabController.php';
        $tabArray = (new TabController())->get_user_tabs($GLOBALS['current_user']);
        $tabArray = array_map('strtolower', $tabArray);

        return $tabArray;
    }

    /**
     * Fetch the module submenus
     * @return array
     */
    protected function fetchModuleSubMenus(): array
    {
        ob_start();
        require_once 'modules/Home/sitemap.php';
        ob_end_clean();

        return sm_build_array();
    }

    /**
     * Fetch Grouped Navigation tabs
     * @return array
     */
    protected function fetchGroupedNavTabs(): array
    {
        $output = [];
        global $current_language;

        require_once 'include/GroupedTabs/GroupedTabStructure.php';
        require_once 'modules/Studio/TabGroups/TabGroupHelper.php';

        $tg = new TabGroupHelper();
        $selectedAppLanguages = return_application_language($current_language);
        $availableModules = $tg->getAvailableModules($current_language);
        $modList = array_keys($availableModules);
        $modList = array_combine($modList, $modList);
        $groupedTabStructure = (new GroupedTabStructure())->get_tab_structure($modList, '', true, true);
        foreach ($groupedTabStructure as $mainTab => $subModules) {
            $groupedTabStructure[$mainTab]['label'] = $mainTab;
            $groupedTabStructure[$mainTab]['labelValue'] = strtolower($selectedAppLanguages[$mainTab]);
            $submoduleArray = [];

            foreach ($subModules['modules'] as $submodule) {
                $submoduleArray[] = strtolower($submodule);
            }

            sort($submoduleArray);

            $output[] = [

                'name' => $groupedTabStructure[$mainTab]['labelValue'],
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

        $labelKeys = [
            'employees' => 'LBL_EMPLOYEES',
            'training' => 'LBL_TRAINING',
            'about' => 'LNK_ABOUT',
            'users' => 'LBL_LOGOUT',
        ];

        foreach ($global_control_links as $key => $value) {
            foreach ($value as $linkAttribute => $attributeValue) {
                // get the main link info
                if ($linkAttribute === 'linkinfo') {
                    $userActionMenu[] = [
                        'name' => strtolower(key($attributeValue)),
                        'labelKey' => $labelKeys[$key],
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
}
