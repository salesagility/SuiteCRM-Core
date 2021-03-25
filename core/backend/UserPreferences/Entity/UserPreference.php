<?php

namespace App\UserPreferences\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ApiResource(
 *     attributes={"security"="is_granted('ROLE_USER')"},
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
class UserPreference
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
     * @var array
     */
    protected $items = [];

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
     * @return UserPreference
     */
    public function setId(?string $id): UserPreference
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
     * @return UserPreference
     */
    public function setValue(?string $value): UserPreference
    {
        $this->value = $value;

        return $this;
    }

    /**
     * Get items
     * @return array
     */
    public function getItems(): array
    {
        return $this->items;
    }

    /**
     * Set Items
     * @param array $items
     * @return UserPreference
     */
    public function setItems(array $items): UserPreference
    {
        $this->items = $items;

        return $this;
    }
}
