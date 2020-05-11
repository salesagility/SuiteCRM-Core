<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ApiResource(
 *     routePrefix="/vardef",
 *     itemOperations={
 *          "get"
 *     },
 *     graphql={
 *         "item_query",
 *      }
 * )
 */
class FieldDefinition
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
     *             "description"="The module vardef.",
     *             "example"="Accounts"
     *         }
     *     },
     *
     * )
     */
    protected $id;

    /**
     * Module vardef metadata
     *
     * @var array
     *
     * @ApiProperty(
     *     attributes={
     *         "openapi_context"={
     *             "type"="array",
     *             "description"="The module metadata",
     *         },
     *     }
     * )
     */
    public $vardef;

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
     * Get vardef metadata
     * @return array
     */
    public function getVardef(): ?array
    {
        return $this->vardef;
    }

    /**
     * Set vardef metadata
     * @param array $vardef
     */
    public function setVardef(array $vardef): void
    {
        $this->vardef = $vardef;
    }
}
