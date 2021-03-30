<?php

namespace SuiteCRM\Core\Base\Module\Storage;

use Doctrine\ORM\EntityRepository;

/**
 * Class Manager
 * @package SuiteCRM\Core\Base\Module\Storage
 */
class Manager extends EntityRepository
{
    public function __construct()
    {
        $evm = new \Doctrine\Common\EventManager();

        // Table Prefix
        $tablePrefix = new \DoctrineExtensions\TablePrefix('prefix_');
        $evm->addEventListener(\Doctrine\ORM\Events::loadClassMetadata, $tablePrefix);

        $em = \Doctrine\ORM\EntityManager::create($connectionOptions, $config, $evm);

        parent::__construct();
    }
}