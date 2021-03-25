<?php

namespace App\Navbar\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ApiResource(
 *     attributes={"security"="is_granted('ROLE_USER')"},
 *     itemOperations={
 *          "get"
 *     },
 *     collectionOperations={
 *     },
 *     graphql={
 *         "item_query"
 *     }
 * )
 */
final class Navbar
{
    /**
     * @ApiProperty(identifier=true)
     */
    public $userID;

    /**
     * @var array
     * @ApiProperty
     */
    public $tabs;

    /**
     * @var array
     * @ApiProperty
     */
    public $groupedTabs;

    /**
     * @var array
     * @ApiProperty
     */
    public $userActionMenu;

    /**
     * @var array
     * @ApiProperty
     */
    public $modules;

    /**
     * @var int
     * @ApiProperty
     */
    public $maxTabs;
}
