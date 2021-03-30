<?php

namespace SuiteCRM\Core\Base\Route;

use SuiteCRM\Core\Base\Helper\Data\CollectionInterface;

use SuiteCRM\Core\Base\Http\Request;

/**
 * Class DefaultRouter
 * @package SuiteCRM\Core\Base\Route
 */
class DefaultRouter implements RouterInterface
{
    /**
     *
     * @var SuiteCRM\Core\Base\Http\Request
     */
    private $requestObj;

    /**
     *
     * @var array
     */
    private $config;

    /**
     * DefaultRouter constructor.
     * @param Request $request
     * @param CollectionInterface $config
     */
    public function __construct(Request $request, CollectionInterface $config)
    {
        $this->requestObj = $request;
        $this->config = $config;
    }

    /**
     * @return object
     * @throws \Exception
     */
    public function load()
    {
        // Check the correct controller and action is going to load based on the URI

        $module = ($this->requestObj->query->has('module')) ? $this->requestObj->query->get('module') : '';
        $controller = ($this->requestObj->query->has('controller')) ? $this->requestObj->query->get('controller') : '';
        $action = ($this->requestObj->query->has('action')) ? $this->requestObj->query->get('action') : '';

        // Run Installer if database config hasn't been configured

        if (empty($module)) {
            // Check mandatory parameters are set

            if (!$this->config->has('app.default_route.module')) {
                throw new \RuntimeException('Default module has not been configured.');
            }

            $module = $this->config->get('app.default_route.module');
        }

        if (empty($controller)) {
            // Check mandatory parameters are set
            if (!$this->config->has('app.default_route.controller')) {
                throw new \RuntimeException('Default controller has not been configured.');
            }

            $controller = $this->config->get('app.default_route.controller');
        }

        if (empty($action)) {
            // Check mandatory parameters are set
            if (!$this->config->has('app.default_route.action')) {
                throw new \RuntimeException('Default action has not been configured.');
            }

            $action = $this->config->get('app.default_route.action');
        }

        $format = 'SuiteCRM\Core\Modules\%s\Controller\%s';

        $controller = sprintf($format, ucfirst($module), ucfirst($controller));

        // run the controller action
        return (object)[
            'module' => $module,
            'controller' => $controller,
            'action' => 'action' . ucfirst($action)
        ];
    }
}
