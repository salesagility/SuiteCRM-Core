<?php

namespace SuiteCRM\Core\Modules\Users;

use SuiteCRM\Core\Base\Module\ModuleInterface;

class Users implements ModuleInterface
{
    /**
     * @return mixed|string
     */
    public function getName()
    {
        return 'Users Module';
    }

    /**
     * @return mixed|string
     */
    public function getDescription()
    {
        return 'This module will allow the user to configurate their user account';
    }
}
