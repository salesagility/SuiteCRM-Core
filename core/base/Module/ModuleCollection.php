<?php

namespace SuiteCRM\Core\Base\Module;

use SuiteCRM\Core\Base\Module\Helper\Collection;

/**
 * Class ModuleCollection
 * @package SuiteCRM\Core\Base\Module
 */
class ModuleCollection extends Collection
{
    /**
     * Load the module collection
     *
     * @param array $params list of modules to chose
     */
    public function __construct($params = [])
    {
        return parent::__construct($params);
    }
}
