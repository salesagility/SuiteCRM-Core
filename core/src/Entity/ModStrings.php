<?php


namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiProperty;

/**
 * @ApiResource(
 *     attributes={"security"="is_granted('ROLE_USER')"},
 *     itemOperations={
 *          "get"
 *     },
 *     collectionOperations={
 *     },
 *     graphql={
 *         "item_query",
 *     },
 * )
 */
class ModStrings
{
    /**
     * @ApiProperty(identifier=true)
     * @var string|null
     */
    protected $id;

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
     * @return ModStrings
     */
    public function setId(?string $id): ModStrings
    {
        $this->id = $id;

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
     * @return ModStrings
     */
    public function setItems(?array $items): ModStrings
    {
        $this->items = $items;

        return $this;
    }
}