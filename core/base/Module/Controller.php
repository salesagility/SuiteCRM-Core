<?php

namespace SuiteCRM\Core\Base\Module;

use Doctrine\Common\Cache\ArrayCache;
use Doctrine\Common\EventManager;
use Doctrine\DBAL\DBALException;
use Doctrine\ORM\Events;
use Doctrine\ORM\ORMException;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Tools\Setup;
use Doctrine\ORM\Mapping\Driver\SimplifiedYamlDriver;

use SuiteCRM\Core\Base\Config\ParameterCollection;
use SuiteCRM\Core\Base\Http\Request;
use SuiteCRM\Core\Base\Http\Response;
use SuiteCRM\Core\Base\Module\Service\ServiceCollection;
use SuiteCRM\Core\Base\Module\Storage\TablePrefix;
use SuiteCRM\Core\Base\Module\View\Handler;

use Exception;

/**
 * Class Controller
 * @package SuiteCRM\Core\Base\Module
 */
class Controller
{

    /**
     *
     * @var ParameterCollection
     */
    protected $config;

    /**
     *
     * @var Request
     */
    protected $requestObj;

    /**
     *
     * @var Response
     */
    protected $responseObj;

    /**
     *
     * @var Session
     */
    protected $session;

    /**
     *
     * @var Handler
     */
    protected $view;

    /**
     *
     * @var ServiceCollection
     */
    protected $services;

    /**
     *
     * @var LegacyWrapper
     */
    protected $legacy;

    /**
     *
     * @var array
     */
    protected $templates;

    /**
     *
     * @var array
     */
    protected $form;

    /**
     * Load base controller variables
     *
     * @param ParameterCollection $config
     * @param Request $request
     * @param Response $response
     * @param Handler $view
     * @param Service\ServiceCollection $services
     */
    public function __construct(
        ParameterCollection $config,
        Request $request,
        Response $response,
        Handler $view,
        ServiceCollection $services
    ) {
        $this->config = $config;
        $this->requestObj = $request;
        $this->responseObj = $response;
        $this->view = $view;
        $this->services = $services;

        if ($this->config->has('storage.mysql.driver')) {
            $connectionParams = $this->config->get('storage.mysql');
            $namespaces = $this->config->get('entity.namespaces');

            $realNamespaces = [];

            foreach ($namespaces as $path => $namespace) {
                $realPath = realpath($path);
                if ($realPath !== false) {
                    $realNamespaces[$realPath] = $namespace;
                }
            }

            $driver = new SimplifiedYamlDriver($realNamespaces);


            $realNamespaces = [];

            foreach ($namespaces as $path => $namespace) {
                $realPath = realpath($path);
                if ($realPath !== false) {
                    $realNamespaces[$realPath] = $namespace;
                }
            }

            $driver = new SimplifiedYamlDriver($realNamespaces);

            $isDevMode = false;

            if ($this->config->has('server.environment') && $this->config->get('server.environment') === 'develop') {
                $isDevMode = true;
            }

            $config = Setup::createYAMLMetadataConfiguration(
                (array)$namespaces,
                $isDevMode
            );

            $cache = new ArrayCache();

            $config->setMetadataCacheImpl($cache);
            $config->setQueryCacheImpl($cache);
            $config->setMetadataDriverImpl($driver);

            // Table Prefix
            $evm = new EventManager();
            $tablePrefix = new TablePrefix('suite8_');
            $evm->addEventListener(Events::loadClassMetadata, $tablePrefix);

            try {
                $entityManager = EntityManager::create($connectionParams, $config, $evm);
            } catch (ORMException $e) {
                trigger_error('Failed to get create entity manager instance: ' . $e);
            }

            //-- This I had to add to support the Mysql enum type.
            try {
                $platform = $entityManager->getConnection()->getDatabasePlatform();
            } catch (DBALException $e) {
                trigger_error('Failed to get DB platform: ' . $e);
            }

            try {
                $platform->registerDoctrineTypeMapping('enum', 'string');
            } catch (DBALException $e) {
                trigger_error('Failed to get register doctrine type mapping: ' . $e);
            }

            $this->em = $entityManager;
        }
    }

    /**
     * Get a storage class
     *
     * @param $namespace
     * @return object
     */
    public function getStorage($namespace)
    {
        [$module, $entityName] = explode('.', $namespace);

        return $this->em->getRepository(
            'SuiteCRM\Core\Modules\\' . ucfirst($module) . '\Entity\\' . ucfirst($entityName)
        );
    }

    /**
     * Get a service class
     *
     * @param $serviceName
     * @return object
     * @throws Exception
     */
    public function getService($serviceName)
    {
        if (!$this->services->has($serviceName)) {
            throw new \RuntimeException('No Service Found: ' . $serviceName);
        }

        return $this->services->get($serviceName);
    }

    /**
     * Quick function to allow for $this->render
     *
     * @param $view
     * @param array $params
     * @param string $template
     * @return string
     */
    public function render($view, $params = [], $template = 'default.html.php'): string
    {
        return $this->view->render($view, $params, $template);
    }

    /**
     * Redirect to URL
     *
     * @param mixed $url Array or string
     * @param mixed $params Params too be sent
     * @param int $statusCode
     * @todo Get Base URL, Concat the Base URL with Route (Controller, Action), Test Array and String
     *
     */
    public function redirect($url, $params = [], $statusCode = 303): void
    {
        $this->session->set('redirectPost', $params);

        if (is_array($url)) {
            $url = implode('/', $url);
        }

        $urlHelper = new Url();

        header('Location: ' . $urlHelper->baseUrl() . $url, true, $statusCode);
        die();
    }

    /**
     * Redirect to URL
     *
     * @param mixed $url URL to redirect to
     * @param int $statusCode Forces the HTTP response code to the specified value. Note that this parameter only has an effect if the header is not empty.
     */
    public function redirectToUrl($url, $statusCode = 303): void
    {
        header('Location: ' . $url, true, $statusCode);
        die();
    }

    /**
     * Create a flash message.
     *
     * @param string $message Flash Message
     * @param string $type Type of Message
     * @return void
     * @todo create one time session var for flash_msg,
     *
     */
    public function flashMsg($message, $type = 'default'): void
    {
        $this->session->set('flashMsg', ['message' => $message, 'type' => $type], 1);
    }

    /**
     * @param $template
     * @param $params
     */
    public function renderTemplate($template, $params): void
    {
        $response = [
            'template' => '
                <div id="harbour">
                    <button (click)="window.alert(\'clicked\')">
                        Click Me
                    </button>
                </div>
            ',
            'scripts' => [
                'https://code.jquery.com/jquery-3.4.1.min.js'
            ]
        ];

        header('Content-Type: application/json');

        echo json_encode($response);
    }
}
