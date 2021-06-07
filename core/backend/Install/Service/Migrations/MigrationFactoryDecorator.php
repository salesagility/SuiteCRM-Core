<?php

namespace App\Install\Service\Migrations;

use Doctrine\Migrations\AbstractMigration;
use Doctrine\Migrations\Version\MigrationFactory;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class MigrationFactoryDecorator implements MigrationFactory
{
    private $migrationFactory;
    private $container;

    /**
     * MigrationFactoryDecorator constructor.
     * @param MigrationFactory $migrationFactory
     * @param ContainerInterface $container
     */
    public function __construct(MigrationFactory $migrationFactory, ContainerInterface $container)
    {
        $this->migrationFactory = $migrationFactory;
        $this->container = $container;
    }

    /**
     * Create Version
     * @param string $migrationClassName
     * @return AbstractMigration
     */
    public function createVersion(string $migrationClassName): AbstractMigration
    {
        $instance = $this->migrationFactory->createVersion($migrationClassName);

        if ($instance instanceof ContainerAwareInterface) {
            $instance->setContainer($this->container);
        }

        return $instance;
    }
}
