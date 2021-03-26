<?php

namespace App\Data\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Data\Resolver\RecordItemResolver;

/**
 * @ApiResource(
 *     attributes={"security"="is_granted('ROLE_USER')"},
 *     itemOperations={
 *          "get"={"path"="/record/{id}"}
 *     },
 *     collectionOperations={},
 *     graphql={
 *          "get"={
 *              "item_query"=RecordItemResolver::class,
 *              "args"={
 *                 "module"={"type"="String!"},
 *                 "record"={"type"="String!"},
 *              }
 *          },
 *          "save"={
 *              "validate"=false,
 *              "args"={
 *                 "_id"={"type"="String", "description"="id"},
 *                 "identifier"={"type"="String", "description"="id"},
 *                 "module"={"type"="String!", "description"="module"},
 *                 "attributes"={"type"="Iterable", "description"="attributes"}
 *              }
 *          },
 *      },
 * )
 */
class Record
{
    /**
     * @ApiProperty(identifier=true)
     * @var string|null
     */
    protected $id;

    /**
     * @ApiProperty
     * @var string|null
     */
    protected $module;

    /**
     * @ApiProperty
     * @var string|null
     */
    protected $type;

    /**
     * @ApiProperty
     * @var array|null
     */
    protected $attributes;

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'id' => $this->getId(),
            'module' => $this->getModule(),
            'type' => $this->getType(),
            'attributes' => $this->getAttributes()
        ];
    }

    /**
     * @return string|null
     */
    public function getId(): ?string
    {
        return $this->id;
    }

    /**
     * @param string|null $id
     */
    public function setId(?string $id): void
    {
        $this->id = $id;
    }

    /**
     * @return string|null
     */
    public function getModule(): ?string
    {
        return $this->module;
    }

    /**
     * @param string|null $module
     * @return Record
     */
    public function setModule(?string $module): Record
    {
        $this->module = $module;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getType(): ?string
    {
        return $this->type;
    }

    /**
     * @param string $type
     * @return Record
     */
    public function setType(?string $type): Record
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get record attributes
     * @return array|null
     */
    public function getAttributes(): ?array
    {
        return $this->attributes;
    }

    /**
     * Set record attributes
     * @param array|null $attributes
     */
    public function setAttributes(?array $attributes): void
    {
        $this->attributes = $attributes;
    }
}
