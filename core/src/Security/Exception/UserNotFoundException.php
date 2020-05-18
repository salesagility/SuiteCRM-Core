<?php

namespace App\Security\Exception;

use Symfony\Component\Security\Core\Exception\AccountStatusException;

class UserNotFoundException extends AccountStatusException
{
    /**
     * @return string
     */
    public function getMessageKey(): string
    {
        return 'User not found.';
    }
}
