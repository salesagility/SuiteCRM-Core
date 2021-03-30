<?php

namespace SuiteCRM\Core\Base\Route;

use SuiteCRM\Core\Base\Route\RouterInterface;
use SuiteCRM\Core\Base\Helper\Data\CollectionInterface;

use SuiteCRM\Core\Base\Http\Request;

/**
 * Class ModRewriteRouter
 * @package SuiteCRM\Core\Base\Route
 */
class ModRewriteRouter implements RouterInterface
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
     * ModRewriteRouter constructor.
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
        if ($this->requestObj->query->has('query_string')) {
            $uri = explode('/', $this->requestObj->query->get('query_string'));

            if (count($uri) === 1) {
                array_push($uri, '', '');
            } elseif (count($uri) === 2) {
                $uri[] = '';
            }

            [$module, $controller, $action] = $uri;
        }

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
