<?php


namespace App\Languages\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ApiResource(
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
class AppStrings
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
     * @return AppStrings
     */
    public function setId(?string $id): AppStrings
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
     * @return AppStrings
     */
    public function setItems(?array $items): AppStrings
    {
        $this->items = $items;

        return $this;
    }
}
