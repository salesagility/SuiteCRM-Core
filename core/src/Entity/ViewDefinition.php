<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ApiResource(
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
     * Detail View metadata
     *
     * @var array
     *
     * @ApiProperty(
     *     attributes={
     *         "openapi_context"={
     *             "type"="array",
     *             "description"="The detail-view metadata",
     *         },
     *     }
     * )
     */
    public $detailView;

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
     * Get Detail View metadata
     * @return array
     */
    public function getDetailView(): ?array
    {
        return $this->detailView;
    }

    /**
     * Set Detail view metadata
     * @param array $detailView
     */
    public function setDetailView(array $detailView): void
    {
        $this->detailView = $detailView;
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
}
