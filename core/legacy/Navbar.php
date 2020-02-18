<?php

namespace SuiteCRM\Core\Legacy;

use RuntimeException;
use TabController;
use GroupedTabStructure;
use TabGroupHelper;

/**
 * Class Navbar
 * @package SuiteCRM\Core\Legacy
 */
class Navbar extends LegacyHandler
{
    /**
     * @return array
     */
    public function getNonGroupedNavTabs(): array
    {
        if ($this->runLegacyEntryPoint()) {
            require LEGACY_PATH . 'modules/MySettings/TabController.php';
            $tabArray = (new TabController())->get_tabs($GLOBALS['current_user']);

            $tabArray = array_keys(array_change_key_case($tabArray[0], CASE_LOWER));
            sort($tabArray);

            return $tabArray;
        }

        throw new RuntimeException('Running legacy entry point failed');
    }

    /**
     * @return array
     */
    public function getGroupedNavTabs(): array
    {
        if ($this->runLegacyEntryPoint()) {
            global $current_language;

            require_once LEGACY_PATH . 'include/GroupedTabs/GroupedTabStructure.php';
            require_once LEGACY_PATH . 'modules/Studio/TabGroups/TabGroupHelper.php';

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

        throw new RuntimeException('Running legacy entry point failed');
    }

    /**
     * @return array
     */
    public function getUserActionMenu(): array
    {
        if ($this->runLegacyEntryPoint()) {
            $userActionMenu = [];
            $global_control_links = [];

            $userActionMenu[] = [
                'name' => 'profile',
                'labelKey' => 'LBL_PROFILE',
                'url' => 'index.php?module=Users&action=EditView&record=1',
                'icon' => '',
            ];

            require LEGACY_PATH . 'include/globalControlLinks.php';

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

        throw new RuntimeException('Running legacy entry point failed');
    }
}
