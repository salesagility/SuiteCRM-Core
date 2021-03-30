<?php

namespace SuiteCRM\Core\Base\Module\Service;

use SuiteCRM\Core\Base\Helper\Data\Collection;

/**
 * Class ServiceCollection
 * @package SuiteCRM\Core\Base\Module\Service
 */
class ServiceCollection extends Collection
{
    /**
     * Load the service collection
     *
     * @param array $services Array of services to change
     */
    public function __construct($services = [])
    {
        return parent::load($services);
    }
}
