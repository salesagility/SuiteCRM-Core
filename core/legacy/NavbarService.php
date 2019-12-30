<?php

namespace SuiteCRM\Core\Legacy;

/**
 * Class NavbarService
 * @package SuiteCRM\Core\Legacy
 */
class NavbarService
{
    /**
     * @return string
     */
    public function getName(): string
    {
        return 'template.navbar';
    }

    /**
     * @return string
     */
    public function getDescription(): string
    {
        return 'This service will deal with retrieval of the navbar structure';
    }

    /**
     * @return mixed
     */
    public function createService()
    {
        return new Navbar();
    }
}
