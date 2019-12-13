<?php

namespace SuiteCRM\Core\Legacy;

use SuiteCRM\Core\Base\Module\Service\ServiceFactoryInterface;

/**
 * Class NavbarService
 * @package SuiteCRM\Core\Legacy
 */
class NavbarService implements ServiceFactoryInterface
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
