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

namespace App\ViewDefinitions\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ApiResource(
 *     attributes={"security"="is_granted('ROLE_USER')"},
 *     routePrefix="/metadata",
 *     itemOperations={
 *          "get"
 *     },
 *     collectionOperations={
 *          "get"
 *     },
 *     graphql={
 *         "item_query",
 *      }
 * )
 */
class ViewDefinition
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
     * @return array
     */
    public function getRecordView(): ?array
    {
        return $this->recordView;
    }

    /**
     * Set Record view metadata
     * @param array $recordView
     */
    public function setRecordView(array $recordView): void
    {
        $this->recordView = $recordView;
    }

    /**
     * Get EditView Metadata
     * @return array
     */
    public function getEditView(): ?array
    {
        return $this->editView;
    }

    /**
     * Set EditView Metadata
     * @param array $editView
     */
    public function setEditView(array $editView): void
    {
        $this->editView = $editView;
    }

    /**
     * Get List View Metadata
     * @return array
     */
    public function getListView(): ?array
    {
        return $this->listView;
    }

    /**
     * Set List View metadata
     * @param array $listView
     */
    public function setListView(array $listView): void
    {
        $this->listView = $listView;
    }

    /**
     * Get Search Metadata
     * @return array
     */
    public function getSearch(): ?array
    {
        return $this->search;
    }

    /**
     * Set Search Metadata
     * @param array $search
     * @return ViewDefinition
     */
    public function setSearch(array $search): ViewDefinition
    {
        $this->search = $search;

        return $this;
    }

    /**
     * Get Subpanel Metadata
     * @return array
     */
    public function getSubPanel(): ?array
    {
        return $this->subpanel;
    }

    /**
     * Set Subpanel Metadata
     * @param array $subpanel
     * @return ViewDefinition
     */
    public function setSubPanel(array $subpanel): ViewDefinition
    {
        $this->subpanel = $subpanel;

        return $this;
    }

    /**
     * Get Mass Update definitions
     * @return array
     */
    public function getMassUpdate(): ?array
    {
        return $this->massUpdate;
    }

    /**
     * Set Mass Update definitions
     * @param array $massUpdate
     * @return ViewDefinition
     */
    public function setMassUpdate(array $massUpdate): ViewDefinition
    {
        $this->massUpdate = $massUpdate;

        return $this;
    }
}
