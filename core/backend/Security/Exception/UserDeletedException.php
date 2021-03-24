<?php

namespace App\Security\Exception;

use Symfony\Component\Security\Core\Exception\AccountStatusException;

class UserDeletedException extends AccountStatusException
{
    /**
     * @return string
     */
    public function getMessageKey(): string
    {
        return 'Invalid user.';
    }
}
