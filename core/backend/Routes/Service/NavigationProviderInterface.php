<?php

namespace App\Routes\Service;

use App\Navbar\Entity\Navbar;

interface NavigationProviderInterface
{
    /**
     * Get Navbar information
     * @return Navbar
     */
    public function getNavbar(): Navbar;
}
