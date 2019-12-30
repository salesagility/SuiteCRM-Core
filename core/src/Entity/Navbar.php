<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiProperty;

/**
 * @ApiResource(
 *     itemOperations={
 *          "get"
 *     },
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
    public $NonGroupedTabs;

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
}
