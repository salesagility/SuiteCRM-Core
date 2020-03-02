<?php

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use ApiPlatform\Core\Exception\ResourceClassNotSupportedException;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Navbar;
use SuiteCRM\Core\Legacy\Navbar as LegacyNavbar;

final class NavbarItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{
    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return Navbar::class === $resourceClass;
    }

    public function getItem(string $resourceClass, $id, string $operationName = null, array $context = []): ?Navbar
    {
        $navbarData = new LegacyNavbar();
        $output = new Navbar();
        // This should be updated once we have authentication.
        $output->userID = 1;
        $output->NonGroupedTabs = $navbarData->getNonGroupedNavTabs();
        $output->groupedTabs = $navbarData->getGroupedNavTabs();
        $output->userActionMenu = $navbarData->getUserActionMenu();
        $output->moduleSubmenus = $navbarData->getModuleSubMenus();
        return $output;
    }
}
