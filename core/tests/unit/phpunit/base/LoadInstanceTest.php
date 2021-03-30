<?php

declare(strict_types=1);

use SuiteCRM\Core\Base\Config\Manager as ConfigManager;

use SuiteCRM\Core\Base\Instance;

use PHPUnit\Framework\TestCase;

final class LoadInstanceTest extends TestCase
{
    protected $instance;

    public function unsetRoute(): void
    {
        $config = new SuiteCRM\Core\Base\Config\Manager();

        $fileHelper = new SuiteCRM\Core\Base\Helper\File\File();

        $configParameters = $config->loadFiles(
            [
                BASE_PATH . '/tests/testdata/InstanceTest/config.yml'
            ]
        );

        $moduleManager = new SuiteCRM\Core\Base\Module\Manager($configParameters, $fileHelper);

        $route = null;
        $this->instance = new Instance($configParameters, $route, $moduleManager);
    }

    public function setUp()
    {
        // Get the Application Path

        // Get the Base Path
        if (!defined('BASE_PATH')) {
            define('BASE_PATH', realpath(__DIR__ . '/../../../../'));
        }

        // Get the Application Path
        if (!defined('APP_PATH')) {
            define('APP_PATH', BASE_PATH . '/modules');
        }

        $config = new SuiteCRM\Core\Base\Config\Manager();

        $fileHelper = new SuiteCRM\Core\Base\Helper\File\File();

        $configParameters = $config->loadFiles(
            [
                BASE_PATH . '/tests/testdata/InstanceTest/config.yml'
            ]
        );

        $route = new stdClass();

        $moduleManager = new SuiteCRM\Core\Base\Module\Manager($configParameters, $fileHelper);

        // Set get variables
        $_GET['module'] = 'Users';
        $_GET['controller'] = 'Oauth';
        $_GET['action'] = 'login';

        $request = new SuiteCRM\Core\Base\Http\Request(
            $_GET,
            $_POST,
            [],
            $_COOKIE,
            $_FILES,
            $_SERVER
        );

        $router = new SuiteCRM\Core\Base\Route\DefaultRouter($request, $configParameters);
        $route = $router->load();

        $this->instance = new Instance($configParameters, $route, $moduleManager);
    }

    public function testRunInstance(): void
    {
        $run = $this->instance->run();

        $this->assertInstanceOf(Instance::class, $run);
    }

    public function testGetAllRoutes(): void
    {
        $route = $this->instance->getAllRoutes();

        $this->assertTrue(true);
    }

    public function testGetRoute(): void
    {
        $route = $this->instance->getRoute();

        $this->assertSame('Users', $route->module);
        $this->assertSame('SuiteCRM\Core\Modules\Users\Controller\Oauth', $route->controller);
        $this->assertSame('actionLogin', $route->action);
    }

    public function testGetAllServices(): void
    {
        $services = $this->instance->getAllServices();

        $this->assertTrue(true);
    }

    public function testGetRouteButRoutesUndefined(): void
    {
        $this->expectException('Exception');
        $this->expectExceptionMessage('Route was not configured');

        $this->unsetRoute();

        $route = $this->instance->getRoute();
    }
}
