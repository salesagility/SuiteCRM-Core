<?php

namespace App\Service;

use App\Entity\Navbar;

interface NavigationProviderInterface
{
    /**
     * Get Navbar information
     * @return Navbar
     */
    public function getNavbar(): Navbar;
}
