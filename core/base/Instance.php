<?php

namespace SuiteCRM\Core\Base;

use SuiteCRM\Core\Base\RunnableInterface;
use SuiteCRM\Core\Base\Helper\Data\CollectionInterface;

/**
 * Class Instance
 * @package SuiteCRM\Core\Base
 */
class Instance implements RunnableInterface
{
    /**
     *
     * @var SuiteCRM\Core\Base\Module\Manager
     */
    protected $modules;

    /**
     *
     * @var stdClass
     */
    protected $route;

    /**
     *
     * @var SuiteCRM\Core\Base\Config\Handler
     */
    protected $config;

    /**
     *
     * @var array
     */
    protected $fileHelper;


    /**
     * Instance constructor.
     * @param CollectionInterface $config
     * @param $route
     * @param $modules
     */
    public function __construct(CollectionInterface $config, $route, $modules)
    {
        $this->modules = $modules;
        $this->config = $config;
        $this->route = $route;
    }

    /**
     * Run the Application
     *
     * @return mixed
     */
    public function run()
    {
        return $this;
    }

    /**
     * Get all routes from enabled modules
     *
     * @return array
     */
    public function getAllRoutes(): ?array
    {
        $allRoutes = [];

        foreach ($this->modules as $module) {
            $allRoutes = array_merge($allRoutes, $module);
        }

        return $allRoutes;
    }

    /**
     * Get the route of the instance call
     *
     * @return mixed
     * @throws \Exception
     */
    public function getRoute()
    {
        if ($this->route === null) {
            throw new \RuntimeException('Route was not configured');
        }

        return $this->route;
    }

    /**
     * Get all services
     *
     * @return array
     */
    public function getAllServices(): array
    {
        $allServices = [];

        foreach ($this->modules as $module) {
            $allServices = array_merge($allServices, $module);
        }

        return $allServices;
    }

}
