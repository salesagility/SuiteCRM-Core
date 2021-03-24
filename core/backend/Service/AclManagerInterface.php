<?php

namespace App\Service;

interface AclManagerInterface
{

    /**
     * Check if current user has access to give module and action
     *
     * @param string $module
     * @param string $action
     * @param bool $isOwner
     * @return bool
     */
    public function checkAccess(string $module, string $action, bool $isOwner = false): bool;
}