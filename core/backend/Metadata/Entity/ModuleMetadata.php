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

namespace App\Metadata\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ApiResource(
 *     attributes={"security"="is_granted('ROLE_USER')"},
 *     itemOperations={
 *           "get"={"path"="/module-metadata/{id}"}
 *     },
 *     collectionOperations={
 *     },
 *     graphql={
 *         "item_query",
 *     }
 * )
 */
class ModuleMetadata
{
    /**
     * Record View metadata
     *
     * @var array
     *
     * @ApiProperty(
     *     attributes={
     *         "openapi_context"={
     *             "type"="array",
     *             "description"="The record-view metadata",
     *         },
     *     }
     * )
     */
    public $recordView;
    /**
     * Edit View metadata
     *
     * @var array
     *
     * @ApiProperty(
     *     attributes={
     *         "openapi_context"={
     *             "type"="array",
     *             "description"="The edit-view metadata",
     *         },
     *     }
     * )
     */
    public $editView;
    /**
     * List View metadata
     *
     * @var array
     *
     * @ApiProperty(
     *     attributes={
     *         "openapi_context"={
     *             "type"="array",
     *             "description"="The list-view metadata",
     *         },
     *     }
     * )
     */
    public $listView;
    /**
     * Search metadata
     *
     * @var array
     *
     * @ApiProperty(
     *     attributes={
     *         "openapi_context"={
     *             "type"="array",
     *             "description"="The search metadata",
     *         },
     *     }
     * )
     */
    public $search;
    /**
     * Subpanel metadata
     *
     * @var array
     *
     * @ApiProperty(
     *     attributes={
     *         "openapi_context"={
     *             "type"="array",
     *             "description"="The subpanel metadata",
     *         },
     *     }
     * )
     */
    public $subpanel;

    /**
     * MassUpdate metadata
     *
     * @var array
     *
     * @ApiProperty(
     *     attributes={
     *         "openapi_context"={
     *             "type"="array",
     *             "description"="The massUpdate metadata",
     *         },
     *     }
     * )
     */
    public $massUpdate;

    /**
     * recentlyViewed
     *
     * @var array
     *
     * @ApiProperty(
     *     attributes={
     *         "openapi_context"={
     *             "type"="array",
     *             "description"="The recently viewed records",
     *         },
     *     }
     * )
     */
    public $recentlyViewed;

    /**
     * Favorites
     *
     * @var array
     *
     * @ApiProperty(
     *     attributes={
     *         "openapi_context"={
     *             "type"="array",
     *             "description"="The favorite records",
     *         },
     *     }
     * )
     */
    public $favorites;

    /**
     * The module
     *
     * @var string
     *
     * @ApiProperty(
     *     identifier=true,
     *     attributes={
     *         "openapi_context"={
     *             "type"="string",
     *             "description"="The module.",
     *             "example"="Accounts"
     *         }
     *     },
     *
     * )
     */
    protected $id;

    /**
     * Get EditView Metadata
     * @return array|null
     */
    public function getEditView(): ?array
    {
        return $this->editView;
    }

    /**
     * Set EditView Metadata
     * @param array|null $editView
     */
    public function setEditView(?array $editView): void
    {
        $this->editView = $editView;
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'id' => $this->getId(),
            '_id' => $this->getId(),
            'recordView' => $this->getRecordView() ?? [],
            'listView' => $this->getListView() ?? [],
            'search' => $this->getSearch() ?? [],
            'subPanel' => $this->getSubPanel() ?? [],
            'massUpdate' => $this->getMassUpdate() ?? [],
            'recentlyViewed' => $this->getRecentlyViewed() ?? [],
            'favorites' => $this->getFavorites() ?? [],
        ];
    }

    /**
     * @return string
     */
    public function getId(): string
    {
        return $this->id;
    }

    /**
     * @param string $id
     */
    public function setId($id): void
    {
        $this->id = $id;
    }

    /**
     * Get Record View metadata
     * @return array|null
     */
    public function getRecordView(): ?array
    {
        return $this->recordView;
    }

    /**
     * Set Record view metadata
     * @param array|null $recordView
     */
    public function setRecordView(?array $recordView): void
    {
        $this->recordView = $recordView;
    }

    /**
     * Get List View Metadata
     * @return array|null
     */
    public function getListView(): ?array
    {
        return $this->listView;
    }

    /**
     * Set List View metadata
     * @param array|null $listView
     */
    public function setListView(?array $listView): void
    {
        $this->listView = $listView;
    }

    /**
     * Get Search Metadata
     * @return array|null
     */
    public function getSearch(): ?array
    {
        return $this->search;
    }

    /**
     * Set Search Metadata
     * @param array|null $search
     * @return ModuleMetadata
     */
    public function setSearch(?array $search): ModuleMetadata
    {
        $this->search = $search;

        return $this;
    }

    /**
     * Get Subpanel Metadata
     * @return array|null
     */
    public function getSubPanel(): ?array
    {
        return $this->subpanel;
    }

    /**
     * Set Subpanel Metadata
     * @param array|null $subpanel
     * @return ModuleMetadata
     */
    public function setSubPanel(?array $subpanel): ModuleMetadata
    {
        $this->subpanel = $subpanel;

        return $this;
    }

    /**
     * Get Mass Update definitions
     * @return array|null
     */
    public function getMassUpdate(): ?array
    {
        return $this->massUpdate;
    }

    /**
     * Set Mass Update definitions
     * @param array|null $massUpdate
     * @return ModuleMetadata
     */
    public function setMassUpdate(?array $massUpdate): ModuleMetadata
    {
        $this->massUpdate = $massUpdate;

        return $this;
    }

    /**
     * Get Recently viewed records
     * @return array|null
     */
    public function getRecentlyViewed(): ?array
    {
        return $this->recentlyViewed;
    }

    /**
     * Set recently viewed
     * @param array|null $recentlyViewed
     * @return ModuleMetadata
     */
    public function setRecentlyViewed(?array $recentlyViewed): ModuleMetadata
    {
        $this->recentlyViewed = $recentlyViewed;

        return $this;
    }

    /**
     * Get favorite records
     * @return array|null
     */
    public function getFavorites(): ?array
    {
        return $this->favorites;
    }

    /**
     * @param array|null $favorites
     * @return ModuleMetadata
     */
    public function setFavorites(?array $favorites): ModuleMetadata
    {
        $this->favorites = $favorites;

        return $this;
    }

}
