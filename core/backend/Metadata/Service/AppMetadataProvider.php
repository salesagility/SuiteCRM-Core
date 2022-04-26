<?php
/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

namespace App\Metadata\Service;

use App\Authentication\LegacyHandler\UserHandler;
use App\Languages\LegacyHandler\AppListStringsHandler;
use App\Languages\LegacyHandler\AppStringsHandler;
use App\Languages\LegacyHandler\ModStringsHandler;
use App\Metadata\Entity\AppMetadata;
use App\Module\Service\ModuleNameMapperInterface;
use App\Navbar\Entity\Navbar;
use App\Routes\Service\NavigationProviderInterface;
use App\SystemConfig\Entity\SystemConfig;
use App\SystemConfig\Service\SystemConfigProviderInterface;
use App\Themes\Service\ThemeImageService;
use App\UserPreferences\Entity\UserPreference;
use App\UserPreferences\Service\UserPreferencesProviderInterface;
use Exception;
use Symfony\Component\Security\Core\Security;

/**
 * Class AppMetadataProvider
 */
class AppMetadataProvider implements AppMetadataProviderInterface
{
    /**
     * @var ModuleNameMapperInterface
     */
    protected $moduleNameMapper;

    /**
     * @var SystemConfigProviderInterface
     */
    protected $systemConfigProvider;

    /**
     * @var UserPreferencesProviderInterface
     */
    protected $userPreferenceService;

    /**
     * @var NavigationProviderInterface
     */
    protected $navigationService;

    /**
     * @var AppStringsHandler
     */
    protected $appStringsHandler;

    /**
     * @var AppListStringsHandler
     */
    protected $appListStringsHandler;

    /**
     * @var ModStringsHandler
     */
    protected $modStringsHandler;

    /**
     * @var ThemeImageService
     */
    protected $themeImageService;

    /**
     * @var ModuleMetadataProviderInterface
     */
    protected $moduleMetadata;

    /**
     * @var Security
     */
    protected $security;

    /**
     * @var UserHandler
     */
    protected $userHandler;

    /**
     * AppMetadataProvider constructor.
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param SystemConfigProviderInterface $systemConfigProvider
     * @param UserPreferencesProviderInterface $userPreferenceService
     * @param NavigationProviderInterface $navigationService
     * @param AppStringsHandler $appStringsHandler
     * @param AppListStringsHandler $appListStringsHandler
     * @param ModStringsHandler $modStringsHandler
     * @param ThemeImageService $themeImageService
     * @param ModuleMetadataProviderInterface $moduleMetadata
     * @param Security $security
     * @param UserHandler $userHandler
     */
    public function __construct(
        ModuleNameMapperInterface $moduleNameMapper,
        SystemConfigProviderInterface $systemConfigProvider,
        UserPreferencesProviderInterface $userPreferenceService,
        NavigationProviderInterface $navigationService,
        AppStringsHandler $appStringsHandler,
        AppListStringsHandler $appListStringsHandler,
        ModStringsHandler $modStringsHandler,
        ThemeImageService $themeImageService,
        ModuleMetadataProviderInterface $moduleMetadata,
        Security $security,
        UserHandler $userHandler
    ) {
        $this->moduleNameMapper = $moduleNameMapper;
        $this->systemConfigProvider = $systemConfigProvider;
        $this->userPreferenceService = $userPreferenceService;
        $this->navigationService = $navigationService;
        $this->appStringsHandler = $appStringsHandler;
        $this->appListStringsHandler = $appListStringsHandler;
        $this->modStringsHandler = $modStringsHandler;
        $this->themeImageService = $themeImageService;
        $this->moduleMetadata = $moduleMetadata;
        $this->security = $security;
        $this->userHandler = $userHandler;
    }

    /**
     * @inheritDoc
     * @throws Exception
     */
    public function getMetadata(string $moduleName, array $exposed = []): AppMetadata
    {
        if ($this->security->isGranted('ROLE_USER')) {
            return $this->getUserMetadata($moduleName, $exposed);
        }

        return $this->getDefaultMetadata($exposed);
    }

    /**
     * @param string $moduleName
     * @param array $exposed
     * @return AppMetadata
     */
    protected function getUserMetadata(string $moduleName, array $exposed = []): AppMetadata
    {
        $metadata = new AppMetadata();
        $metadata->setId('app');
        $language = $this->getLanguage();
        $theme = $this->getTheme();

        $metadata->setSystemConfig([]);
        if (in_array('systemConfig', $exposed, true)) {
            $metadata->setSystemConfig($this->getSystemConfigs());
        }

        $metadata->setUserPreferences([]);
        if (in_array('userPreferences', $exposed, true)) {
            $metadata->setUserPreferences($this->getUserPreferences());
        }

        $metadata->setLanguage([]);
        if (in_array('language', $exposed, true)) {
            $metadata->setLanguage($this->getLanguageStrings($language) ?? []);
        }

        $metadata->setThemeImages([]);
        if (in_array('themeImages', $exposed, true)) {
            $metadata->setThemeImages($this->themeImageService->get($theme)->toArray());
        }


        $navigation = $this->navigationService->getNavbar();
        $metadata->setNavigation([]);
        if (in_array('navigation', $exposed, true)) {
            $metadata->setNavigation($navigation->toArray());
        }

        $metadata->setModuleMetadata([]);
        $metadata->setMinimalModuleMetadata([]);
        if (in_array('moduleMetadata', $exposed, true)) {
            $metadata->setModuleMetadata($this->getModuleMetadata($moduleName, $navigation));
        } elseif (in_array('minimalModuleMetadata', $exposed, true)) {
            $metadata->setMinimalModuleMetadata($this->getMinimalModuleMetadata($moduleName));
        }

        return $metadata;
    }

    /**
     * @return string
     */
    protected function getLanguage(): string
    {
        $language = $this->getDefaultLanguage();

        $prefLanguage = $this->userHandler->getUserPreferencesLanguage();
        if ($prefLanguage !== '') {
            $language = $prefLanguage;
        }

        $sessionLanguage = $this->userHandler->getSessionLanguage();
        if (!empty($sessionLanguage)) {
            $language = $sessionLanguage;
        }

        return $language;
    }

    /**
     * @return string|null
     */
    protected function getDefaultLanguage(): ?string
    {
        $language = 'en_us';

        $configLanguage = $this->userHandler->getSystemLanguage();
        if ($configLanguage !== '') {
            $language = $configLanguage;
        }

        return $language;
    }

    /**
     * @return string|null
     */
    protected function getDefaultMetadataLanguage(): ?string
    {
        $language = $this->getDefaultLanguage();
        $sessionLanguage = $this->userHandler->getSessionLanguage();
        if (!empty($sessionLanguage)) {
            $language = $sessionLanguage;
        }

        return $language;
    }

    /**
     * @return string
     */
    protected function getTheme(): string
    {
        $theme = $this->getDefaultTheme();

        $preference = $this->userPreferenceService->getUserPreference('global');
        if ($preference !== null && !empty($preference->getItems())) {
            $prefTheme = $preference->getItems()['user_theme'] ?? '';
            if ($prefTheme !== '') {
                $theme = $prefTheme;
            }
        }

        return $theme;
    }

    /**
     * @return string|null
     */
    protected function getDefaultTheme(): ?string
    {
        $theme = 'suite8';

        $config = $this->systemConfigProvider->getSystemConfig('default_theme');
        if ($config !== null) {
            $configTheme = $config->getValue() ?? '';
            if ($configTheme !== '') {
                $theme = $configTheme;
            }
        }

        return $theme;
    }

    /**
     * @return array
     */
    protected function getSystemConfigs(): array
    {
        $configs = [];
        /** @var SystemConfig[] $configEntities */
        $configEntities = $this->systemConfigProvider->getAllSystemConfigs() ?? [];

        foreach ($configEntities as $configEntity) {
            if ($configEntity === null) {
                continue;
            }
            $configs[$configEntity->getId()] = $configEntity->toArray();
        }

        return $configs;
    }

    /**
     * @return array
     */
    protected function getUserPreferences(): array
    {
        $preferences = [];
        /** @var UserPreference[] $preferencesEntities */
        $preferencesEntities = $this->userPreferenceService->getAllUserPreferences() ?? [];

        foreach ($preferencesEntities as $preferenceEntity) {
            if ($preferenceEntity === null) {
                continue;
            }
            $preferences[$preferenceEntity->getId()] = $preferenceEntity->toArray();
        }

        return $preferences;
    }

    /**
     * @param string $language
     * @return array
     */
    protected function getLanguageStrings(string $language): array
    {
        $appStrings = $this->getAppStrings($language);

        $appListStrings = [];
        $appListStringsEntity = $this->appListStringsHandler->getAppListStrings($language);
        if ($appListStringsEntity !== null) {
            $appListStrings = $appListStringsEntity->toArray() ?? [];
        }

        $modStrings = [];
        $modStringsEntity = $this->modStringsHandler->getModStrings($language);
        if ($modStringsEntity !== null) {
            $modStrings = $modStringsEntity->toArray() ?? [];
        }

        return [
            'appStrings' => $appStrings,
            'appListStrings' => $appListStrings,
            'modStrings' => $modStrings,
        ];
    }

    /**
     * @param string $language
     * @return array
     */
    protected function getAppStrings(string $language): array
    {
        $appStrings = [];
        $appStringsEntity = $this->appStringsHandler->getAppStrings($language);
        if ($appStringsEntity !== null) {
            $appStrings = $appStringsEntity->toArray() ?? [];
        }

        return $appStrings;
    }

    /**
     * @param string $module
     * @param Navbar $navigation
     * @return array
     */
    protected function getModuleMetadata(string $module, Navbar $navigation): array
    {
        $max = $navigation->maxTabs;
        $modules = $navigation->tabs ?? [];

        if (!in_array($module, $modules, true)) {
            $modules[] = $module;
        }

        $toExclude = [
            'login' => true,
            'Login' => true,
            'home' => true,
            'calendar' => true,
        ];

        $type = $navigation->type ?? '';
        if ($type === 'gm') {
            $groupedTabsModules = $this->getGroupedTabModules($navigation, $module);

            return $this->loadModuleMetadata($modules, $toExclude, count($groupedTabsModules));
        }

        return $this->loadModuleMetadata($modules, $toExclude, $max);
    }

    /**
     * @param array $modules
     * @param array $toExclude
     * @param int $max
     * @return array
     */
    protected function loadModuleMetadata(array $modules, array $toExclude, int $max): array
    {
        $moduleMetadata = [];
        $i = 0;
        foreach ($modules as $module) {
            $isToExclude = $toExclude[$module] ?? false;
            if ($isToExclude) {
                continue;
            }

            $moduleMetadata[$module] = $this->moduleMetadata->getMetadata($module)->toArray();
            if ($i >= $max) {
                break;
            }
            $i++;
        }

        return $moduleMetadata;
    }

    /**
     * @param string $module
     * @return array
     */
    protected function getMinimalModuleMetadata(string $module): array
    {
        $modules = [
            $module,
            'saved-search'
        ];

        $toExclude = [
            'login' => true,
            'Login' => true,
            'home' => true,
            'calendar' => true,
        ];

        return $this->loadModuleMetadata($modules, $toExclude, 2);
    }

    /**
     * @param array $exposed
     * @return AppMetadata
     */
    protected function getDefaultMetadata(array $exposed = []): AppMetadata
    {
        $metadata = new AppMetadata();
        $metadata->setId('app');
        $metadata->setUserPreferences([]);
        $metadata->setModuleMetadata([]);
        $metadata->setNavigation([]);

        $language = $this->getDefaultMetadataLanguage();

        $theme = $this->getDefaultTheme();

        $metadata->setSystemConfig([]);
        if (in_array('systemConfig', $exposed, true)) {
            $metadata->setSystemConfig($this->getSystemConfigs());
        }

        $appStrings = $this->getAppStrings($language);

        $languages = [
            'appStrings' => $appStrings,
            'appListStrings' => [],
            'modStrings' => [],
        ];

        $metadata->setLanguage([]);
        if (in_array('language', $exposed, true)) {
            $metadata->setLanguage($languages);
        }

        $metadata->setThemeImages([]);
        if (in_array('themeImages', $exposed, true)) {
            $metadata->setThemeImages($this->themeImageService->get($theme)->toArray());
        }

        return $metadata;
    }

    /**
     * @param Navbar $navigation
     * @param string $module
     * @return string[]
     */
    protected function getGroupedTabModules(Navbar $navigation, string $module): array
    {
        $groupedTabs = $navigation->groupedTabs ?? [];
        $groupedTabsModules = [];

        foreach ($groupedTabs as $groupedTab) {
            foreach ($groupedTab['modules'] ?? [] as $groupedTabsModule) {
                $groupedTabsModules[$groupedTabsModule] = true;
            }
        }

        return array_keys($groupedTabsModules);
    }
}
