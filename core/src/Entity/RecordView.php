<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiProperty;
use App\Resolver\RecordViewResolver;

/**
 * @ApiResource(
 *     attributes={"security"="is_granted('ROLE_USER')"},
 *     itemOperations={
 *          "get"={"path"="/record/{id}"}
 *     },
 *     collectionOperations={},
 *     graphql={
 *          "get"={
 *              "item_query"=RecordViewResolver::class,
 *              "args"={
 *                 "module"={"type"="String!"},
 *                 "record"={"type"="String!"},
 *              }
 *          },
 *      },
 * )
 */
class RecordView
{
    /**
     * The record ID
     *
     * @var string
     *
     * @ApiProperty(
     *     identifier=true,
     *     attributes={
     *         "openapi_context"={
     *             "type"="string",
     *             "description"="The record ID.",
     *         }
     *     },
     *
     * )
     */
    protected $id;

    /**
     * RecordView data
     *
     * @var array
     *
     * @ApiProperty(
     *     attributes={
     *         "openapi_context"={
     *             "type"="array",
     *             "description"="The record-view data",
     *         },
     *     }
     * )
     */
    public $record;

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
     * Get RecordView record
     * @return array
     */
    public function getRecord(): ?array
    {
        return $this->record;
    }

    /**
     * Set RecordView record
     * @param array $record
     */
    public function setRecord(array $record): void
    {
        $this->record = $record;
    }
}
