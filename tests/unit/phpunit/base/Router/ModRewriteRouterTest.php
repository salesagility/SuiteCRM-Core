<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use SuiteCRM\Core\Base\Helper\File\File as FileHelper;
use SuiteCRM\Core\Base\Instance;


final class ModRewriteRouterTest extends TestCase
{
    protected $request;

    protected $config;

    protected $fileHelper;

    protected $instance;

    public function setUp()
    {
        // Get the Application Path

        // Get the Base Path
        if (!defined('BASE_PATH')) {
            define('BASE_PATH', realpath(__DIR__ . '/../../../../../'));
        }

        // Get the Application Path
        if (!defined('APP_PATH')) {
            define('APP_PATH', BASE_PATH . '/modules');
        }

        $this->fileHelper = new SuiteCRM\Core\Base\Helper\File\File();
    }


    public function testNoAction(): void
    {
        $_GET['query_string'] = 'users/oauth';

        $this->expectException('Exception');
        $this->expectExceptionMessage('Default action has not been configured.');

        $config = new SuiteCRM\Core\Base\Config\Manager();

        $configParameters = $config->loadFiles(
            [
                BASE_PATH . '/tests/testdata/RouterTest/ModRewriteRouter/config.yml'
            ]
        );

        $route = new stdClass();

        $this->assertInstanceOf(FileHelper::class, $this->fileHelper);

        $moduleManager = new SuiteCRM\Core\Base\Module\Manager($configParameters, $this->fileHelper);

        // Set get variables
        $_GET['module'] = 'Users';
        $_GET['controller'] = 'Oauth';

        $request = new SuiteCRM\Core\Base\Http\Request(
            $_GET,
            $_POST,
            [],
            $_COOKIE,
            $_FILES,
            $_SERVER
        );

        $router = new SuiteCRM\Core\Base\Route\ModRewriteRouter($request, $configParameters);
        $route = $router->load();
    }

    public function testDefaultAction(): void
    {
        $_GET['query_string'] = 'users/oauth';

        $config = new SuiteCRM\Core\Base\Config\Manager();

        $fileHelper = new SuiteCRM\Core\Base\Helper\File\File();

        $configParameters = $config->loadFiles(
            [
                BASE_PATH . '/tests/testdata/RouterTest/ModRewriteRouter/defaultaction.config.yml'
            ]
        );

        $route = new stdClass();

        $moduleManager = new SuiteCRM\Core\Base\Module\Manager($configParameters, $fileHelper);

        // Set get variables
        $_GET['module'] = 'Users';
        $_GET['controller'] = 'Oauth';
        $_GET['action'] = '';

        $request = new SuiteCRM\Core\Base\Http\Request(
            $_GET,
            $_POST,
            [],
            $_COOKIE,
            $_FILES,
            $_SERVER
        );

        $router = new SuiteCRM\Core\Base\Route\ModRewriteRouter($request, $configParameters);
        $route = $router->load();

        $this->assertSame('users', $route->module);

        $this->instance = new Instance($configParameters, $route, $moduleManager);

        $this->assertInstanceOf(Instance::class, $this->instance);
    }

    public function testNoController(): void
    {
        $_GET['query_string'] = 'users/';

        $this->expectException('Exception');
        $this->expectExceptionMessage('Default controller has not been configured.');

        $config = new SuiteCRM\Core\Base\Config\Manager();

        $configParameters = $config->loadFiles(
            [
                BASE_PATH . '/tests/testdata/RouterTest/ModRewriteRouter/config.yml'
            ]
        );

        $route = new stdClass();

        $this->assertInstanceOf(FileHelper::class, $this->fileHelper);

        $moduleManager = new SuiteCRM\Core\Base\Module\Manager($configParameters, $this->fileHelper);

        // Set get variables
        $_GET['module'] = 'Users';
        $_GET['controller'] = '';

        $request = new SuiteCRM\Core\Base\Http\Request(
            $_GET,
            $_POST,
            [],
            $_COOKIE,
            $_FILES,
            $_SERVER
        );

        $router = new SuiteCRM\Core\Base\Route\ModRewriteRouter($request, $configParameters);
        $route = $router->load();
    }

    public function testDefaultController(): void
    {
        $_GET['query_string'] = 'users/';

        $config = new SuiteCRM\Core\Base\Config\Manager();

        $fileHelper = new SuiteCRM\Core\Base\Helper\File\File();

        $configParameters = $config->loadFiles(
            [
                BASE_PATH . '/tests/testdata/RouterTest/ModRewriteRouter/defaultcontroller.config.yml'
            ]
        );

        $route = new stdClass();

        $moduleManager = new SuiteCRM\Core\Base\Module\Manager($configParameters, $fileHelper);

        // Set get variables
        $_GET['module'] = 'Users';
        $_GET['controller'] = '';
        $_GET['action'] = 'login';

        $request = new SuiteCRM\Core\Base\Http\Request(
            $_GET,
            $_POST,
            [],
            $_COOKIE,
            $_FILES,
            $_SERVER
        );

        $router = new SuiteCRM\Core\Base\Route\ModRewriteRouter($request, $configParameters);
        $route = $router->load();

        $this->assertSame('users', $route->module);

        $this->instance = new Instance($configParameters, $route, $moduleManager);

        $this->assertInstanceOf(Instance::class, $this->instance);
    }

    public function testNoModule(): void
    {
        $_GET['query_string'] = '';

        $this->expectException('Exception');
        $this->expectExceptionMessage('Default module has not been configured.');

        $config = new SuiteCRM\Core\Base\Config\Manager();

        $configParameters = $config->loadFiles(
            [
                BASE_PATH . '/tests/testdata/RouterTest/ModRewriteRouter/config.yml'
            ]
        );

        $route = new stdClass();

        $this->assertInstanceOf(FileHelper::class, $this->fileHelper);

        $moduleManager = new SuiteCRM\Core\Base\Module\Manager($configParameters, $this->fileHelper);

        // Set get variables
        $_GET['module'] = '';

        $request = new SuiteCRM\Core\Base\Http\Request(
            $_GET,
            $_POST,
            [],
            $_COOKIE,
            $_FILES,
            $_SERVER
        );

        $router = new SuiteCRM\Core\Base\Route\ModRewriteRouter($request, $configParameters);
        $route = $router->load();
    }

    public function testDefaultModule(): void
    {
        $_GET['query_string'] = '';

        $this->expectException('Exception');
        $this->expectExceptionMessage('Default controller has not been configured.');

        $config = new SuiteCRM\Core\Base\Config\Manager();

        $fileHelper = new SuiteCRM\Core\Base\Helper\File\File();

        $configParameters = $config->loadFiles(
            [
                BASE_PATH . '/tests/testdata/RouterTest/ModRewriteRouter/defaultmodule.config.yml'
            ]
        );

        $route = new stdClass();

        $moduleManager = new SuiteCRM\Core\Base\Module\Manager($configParameters, $fileHelper);

        // Set get variables
        $_GET['module'] = '';
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

        $router = new SuiteCRM\Core\Base\Route\ModRewriteRouter($request, $configParameters);
        $route = $router->load();

        $this->assertSame('users', $route->module);

        $this->instance = new Instance($configParameters, $route, $moduleManager);

        $this->assertInstanceOf(Instance::class, $this->instance);
    }
}