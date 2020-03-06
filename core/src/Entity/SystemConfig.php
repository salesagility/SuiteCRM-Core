<?php


namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiProperty;

/**
 * @ApiResource(
 *     itemOperations={
 *          "get"
 *     },
 *     collectionOperations={
 *          "get"
 *     },
 *     graphql={
 *         "item_query",
 *         "collection_query"
 *     },
 * )
 */
class SystemConfig
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
    protected $value;

    /**
     * @ApiProperty
     * @var array|null
     */
    protected $items;

    /**
     * Get Id
     * @return string|null
     */
    public function getId(): ?string
    {
        return $this->id;
    }

    /**
     * Set Id
     * @param string|null $id
     * @return SystemConfig
     */
    public function setId(?string $id): SystemConfig
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get value
     * @return string|null
     */
    public function getValue(): ?string
    {
        return $this->value;
    }

    /**
     * Set value
     * @param string|null $value
     * @return SystemConfig
     */
    public function setValue(?string $value): SystemConfig
    {
        $this->value = $value;

        return $this;
    }

    /**
     * Get items
     * @return array|null
     */
    public function getItems(): ?array
    {
        return $this->items;
    }

    /**
     * Set Items
     * @param array|null $items
     * @return SystemConfig
     */
    public function setItems(?array $items): SystemConfig
    {
        $this->items = $items;

        return $this;
    }
}