<?php

namespace SuiteCRM\Core\Modules\Administration;

use SuiteCRM\Core\Base\Module\ModuleInterface;

/**
 * Class Administration
 * @package SuiteCRM\Core\Modules\Administration
 */
class Administration implements ModuleInterface
{
    /**
     * @return string
     */
    public function getName(): string
    {
        return 'Administration Module';
    }

    /**
     * @return string
     */
    public function getDescription(): string
    {
        return 'This module will allow administrators to configure the system';
    }
}
