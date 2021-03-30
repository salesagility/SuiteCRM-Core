<?php

namespace SuiteCRM\Core\Modules\Users\Service;

use SuiteCRM\Core\Module\Service\ServiceFactoryInterface;

use SuiteCRM\Core\Modules\Users\Helper\Authentication;

class AuthenticationService implements ServiceFactoryInterface
{
    /**
     * @return string
     */
    public function getName(): string
    {
        return 'users.authentication';
    }

    /**
     * @return string
     */
    public function getDescription(): string
    {
        return 'This service will deal with legacy authentication';
    }

    /**
     * @return Authentication
     */
    public function createService(): Authentication
    {
        return new Authentication();
    }
}