<?php

namespace App\Security;

use App\Entity\User;
use App\Security\Exception\UserDeletedException;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class UserChecker implements UserCheckerInterface
{
    /**
     * @param UserInterface $user
     */
    public function checkPreAuth(UserInterface $user): void
    {
        $this->checkUserStatus($user);
    }

    /**
     * @param UserInterface $user
     * @return void
     */
    private function checkUserStatus(UserInterface $user): void
    {
        if (!$user instanceof User) {
            return;
        }

        if ($user->getDeleted()) {
            throw new UserDeletedException('Authentication: Invalid user');
        }
    }

    /**
     * @param UserInterface $user
     */
    public function checkPostAuth(UserInterface $user): void
    {
        $this->checkUserStatus($user);
    }
}
