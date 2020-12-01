<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Resolver\RecordListResolver;

/**
 * @ApiResource(
 *     attributes={"security"="is_granted('ROLE_USER')"},
 *     itemOperations={
 *          "get"={"path"="/record-list/{id}"}
 *     },
 *     collectionOperations={},
 *     graphql={
 *          "get"={
 *              "item_query"=RecordListResolver::class,
 *              "args"={
 *                 "module"={"type"="String!"},
 *                 "limit"={"type"="Int"},
 *                 "offset"={"type"="Int"},
 *                 "criteria"={"type"="Iterable" , "description"="search criteria"},
 *                 "sort"={"type"="Iterable" , "description"="sort"}
 *              }
 *          },
 *      },
 * )
 */
class RecordList
{
    /**
     * RecordList data
     *
     * @var array
     *
     * @ApiProperty(
     *     attributes={
     *         "openapi_context"={
     *             "type"="array",
     *             "description"="The list-view data",
     *         },
     *     }
     * )
     */
    public $records;
    /**
     * RecordList metadata
     *
     * @var array
     *
     * @ApiProperty(
     *     attributes={
     *         "openapi_context"={
     *             "type"="array",
     *             "description"="The list metadata",
     *         },
     *     }
     * )
     */
    public $meta;
    /**
     * RecordList filters
     *
     * @var array
     *
     * @ApiProperty(
     *     attributes={
     *         "openapi_context"={
     *             "type"="array",
     *             "description"="The list-view filters",
     *         },
     *     }
     * )
     */
    public $filters;
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
     * Get records
     * @return array
     */
    public function getRecords(): ?array
    {
        return $this->records;
    }

    /**
     * Set records
     * @param array $records
     */
    public function setRecords(array $records): void
    {
        $this->records = $records;
    }

    /**
     * Get meta
     * @return array
     */
    public function getMeta(): array
    {
        return $this->meta;
    }

    /**
     * Set meta
     * @param array $meta
     */
    public function setMeta(array $meta): void
    {
        $this->meta = $meta;
    }

    /**
     * get filters
     * @return array
     */
    public function getFilters(): ?array
    {
        return $this->filters;
    }

    /**
     * Set filters
     * @param array $filters
     */
    public function setFilters(array $filters): void
    {
        $this->filters = $filters;
    }
}
