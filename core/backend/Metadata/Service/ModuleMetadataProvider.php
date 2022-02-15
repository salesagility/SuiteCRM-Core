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

use App\Metadata\Entity\ModuleMetadata;
use App\Module\LegacyHandler\Favorites\FavoritesHandler;
use App\Module\LegacyHandler\RecentlyViewed\RecentlyViewedHandler;
use App\Module\Service\ModuleNameMapperInterface;
use App\ViewDefinitions\Service\ViewDefinitionsProviderInterface;
use Exception;

/**
 * Class ViewDefinitionsHandler
 */
class ModuleMetadataProvider implements ModuleMetadataProviderInterface
{
    /**
     * @var ModuleNameMapperInterface
     */
    protected $moduleNameMapper;

    /**
     * @var ViewDefinitionsProviderInterface
     */
    protected $viewDefinitions;

    /**
     * @var RecentlyViewedHandler
     */
    protected $recentlyViewed;

    /**
     * @var FavoritesHandler
     */
    protected $favorites;

    /**
     * ModuleMetadataProvider constructor.
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param ViewDefinitionsProviderInterface $viewDefinitions
     * @param RecentlyViewedHandler $recentlyViewed
     * @param FavoritesHandler $favorites
     */
    public function __construct(
        ModuleNameMapperInterface $moduleNameMapper,
        ViewDefinitionsProviderInterface $viewDefinitions,
        RecentlyViewedHandler $recentlyViewed,
        FavoritesHandler $favorites
    ) {
        $this->moduleNameMapper = $moduleNameMapper;
        $this->viewDefinitions = $viewDefinitions;
        $this->recentlyViewed = $recentlyViewed;
        $this->favorites = $favorites;
    }

    /**
     * @inheritDoc
     * @throws Exception
     */
    public function getMetadata(string $moduleName, array $exposed = []): ModuleMetadata
    {
        $metadata = new ModuleMetadata();
        $metadata->setId($moduleName);

        $viewDefinitions = $this->viewDefinitions->getViewDefs($moduleName, $exposed);

        $metadata->setSearch($viewDefinitions->getSearch() ?? []);
        $metadata->setListView($viewDefinitions->getListView() ?? []);
        $metadata->setMassUpdate($viewDefinitions->getMassUpdate() ?? []);
        $metadata->setSubPanel($viewDefinitions->getSubPanel() ?? []);
        $metadata->setRecordView($viewDefinitions->getRecordView() ?? []);
        $metadata->setRecentlyViewed($this->recentlyViewed->getModuleTrackers($moduleName));
        $metadata->setFavorites($this->favorites->getModuleFavorites($moduleName));

        return $metadata;
    }
}
