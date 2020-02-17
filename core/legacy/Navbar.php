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
            $last = [];

            $userActionMenu[] = [
                'label' => 'Profile',
                'url' => 'index.php?module=Users&action=EditView&record=1',
                'submenu' => [],
            ];

            require LEGACY_PATH . 'include/globalControlLinks.php';

            foreach ($global_control_links as $key => $value) {
                if ($key === 'users') {
                    $last[] = [
                        'label' => key($value['linkinfo']),
                        'url' => $value['linkinfo'][key($value['linkinfo'])],
                        'submenu' => [],
                    ];

                    continue;
                }

                foreach ($value as $linkAttribute => $attributeValue) {
                    // get the main link info
                    if ($linkAttribute === 'linkinfo') {
                        $userActionMenu[] = [
                            'label' => key($attributeValue),
                            'url' => current($attributeValue),
                            'submenu' => [],
                        ];

                        $userActionMenuCount = count($userActionMenu);
                        $key = $userActionMenuCount - 1;

                        if (strpos($userActionMenu[$key]['url'], 'javascript:') === 0) {
                            $userActionMenu[$key]['event']['onClick'] = substr($userActionMenu[$key]['url'], 11);
                            $userActionMenu[$key]['url'] = 'javascript:void(0)';
                        }
                    }
                    // Get the sub links
                    if ($linkAttribute === 'submenu' && is_array($attributeValue)) {
                        $subMenuLinkKey = '';
                        foreach ($attributeValue as $submenuLinkKey => $submenuLinkInfo) {
                            $userActionMenu[$key]['submenu'][$submenuLinkKey] = [
                                'label' => key($submenuLinkInfo),
                                'url' => current($submenuLinkInfo),
                            ];
                        }
                        if (strpos($userActionMenu[$key]['submenu'][$subMenuLinkKey]['url'], 'javascript:') === 0) {
                            $userActionMenu[$key]['submenu'][$subMenuLinkKey]['event']['onClick'] =
                                substr($userActionMenu[$key]['submenu'][$subMenuLinkKey]['url'], 11);
                            $userActionMenu[$key]['submenu'][$subMenuLinkKey]['url'] = 'javascript:void(0)';
                        }
                    }
                }
            }

            return $userActionMenu[] = array_merge($userActionMenu, $last);
        }

        throw new RuntimeException('Running legacy entry point failed');
    }
}
