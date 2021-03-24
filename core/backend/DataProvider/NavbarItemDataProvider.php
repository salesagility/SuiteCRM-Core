<?php

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\Navbar;
use App\Service\NavigationProviderInterface;
use Symfony\Component\Security\Core\Security;

final class NavbarItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{
    /**
     * @var NavigationProviderInterface
     */
    private $navigationService;

    /**
     * @var Security
     */
    private $security;

    /**
     * NavbarItemDataProvider constructor.
     * @param NavigationProviderInterface $navigationService
     * @param Security $security
     */
    public function __construct(NavigationProviderInterface $navigationService, Security $security)
    {
        $this->navigationService = $navigationService;
        $this->security = $security;
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
        $navbar = $this->navigationService->getNavbar();
        $user = $this->security->getUser();
        $navbar->userID = $user->getId();

        return $navbar;
    }
}
