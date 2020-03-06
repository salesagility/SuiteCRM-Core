<?php

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use SuiteCRM\Core\Legacy\NavbarHandler;
use App\Entity\Navbar;

final class NavbarItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{
    /**
     * @var NavbarHandler
     */
    private $navbarHandler;

    /**
     * NavbarItemDataProvider constructor.
     * @param NavbarHandler $navbarHandler
     */
    public function __construct(NavbarHandler $navbarHandler)
    {
        $this->navbarHandler = $navbarHandler;
    }

    /**
     * Define supported resources
     * @param string $resourceClass
     * @param string|null $operationName
     * @param array $context
     * @return bool
     */
    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return Navbar::class === $resourceClass;
    }

    /**
     * Get navbar
     * @param string $resourceClass
     * @param array|int|string $id
     * @param string|null $operationName
     * @param array $context
     * @return Navbar|null
     */
    public function getItem(string $resourceClass, $id, string $operationName = null, array $context = []): ?Navbar
    {
        $navbar = $this->navbarHandler->getNavbar();
        // This should be updated once we have authentication.
        $navbar->userID = 1;

        return $navbar;
    }
}
