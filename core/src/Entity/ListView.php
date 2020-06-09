<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiProperty;
use App\Resolver\ListViewResolver;

/**
 * @ApiResource(
 *     itemOperations={
 *          "get"={"path"="/records/{id}"}
 *     },
 *     collectionOperations={},
 *     graphql={
 *          "get"={
 *              "item_query"=ListViewResolver::class,
 *              "args"={
 *                 "module"={"type"="String!"},
 *                 "limit"={"type"="Int"},
 *                 "offset"={"type"="Int"},
 *                 "criteria"={"type"="Iterable" , "description"="search criteria"}
 *              }
 *          },
 *      },
 * )
 */
class ListView
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
     * ListView data
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
     * ListView metadata
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
    public $meta;

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
     * Get ListView records
     * @return array
     */
    public function getRecords(): ?array
    {
        return $this->records;
    }

    /**
     * Set ListView records
     * @param array $records
     */
    public function setRecords(array $records): void
    {
        $this->records = $records;
    }

    /**
     * Get ListView meta
     * @return array
     */
    public function getMeta(): array
    {
        return $this->meta;
    }

    /**
     * Set ListView meta
     * @param array $meta
     */
    public function setMeta(array $meta): void
    {
        $this->meta = $meta;
    }
}
