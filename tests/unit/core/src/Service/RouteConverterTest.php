<?php namespace App\Tests;

use App\Service\ModuleNameMapper;
use App\Service\RouteConverter;
use \Codeception\Test\Unit;
use InvalidArgumentException;
use Symfony\Component\HttpFoundation\Request;

class RouteConverterTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;


    /**
     * @var RouteConverter
     */
    private $routeConverter;

    protected function _before()
    {
        $legacyModuleNameMap = [
            'Contacts' => [
                'frontend' => 'contacts',
                'core' => 'Contacts'
            ],
        ];

        $legacyActionNameMap = [
            'index ' => 'index',
            'detailview' => 'detail',
            'editview' => 'edit',
            'listview' => 'list',
        ];

        $moduleMapper = new ModuleNameMapper($legacyModuleNameMap);
        $this->routeConverter = new RouteConverter($moduleMapper, $legacyActionNameMap);
    }

    public function testAPIRequestCheck()
    {
        $queryParams = [
        ];

        $serverParams = [
            'REDIRECT_BASE' => '/suiteinstance',
            'BASE' => '/suiteinstance',
            'HTTP_HOST' => 'localhost',
            'HTTP_ORIGIN' => 'http://localhost',
            'HTTP_REFERER' => 'http://localhost/suiteinstance/public/docs/graphql-playground/index.html',
            'SERVER_NAME' => 'localhost',
            'REDIRECT_URL' => '/suiteinstance/api/graphql',
            'REQUEST_METHOD' => 'POST',
            'REQUEST_URI' => '/suiteinstance/api/graphql',
            'SCRIPT_FILENAME' => '/var/www/html/suiteinstance/index.php',
            'SCRIPT_NAME' => '/suiteinstance/index.php',
            'PHP_SELF' => '/suiteinstance/index.php',
        ];

        $request = new Request($queryParams,[],[],[],[], $serverParams);

        $valid = $this->routeConverter->isLegacyRoute($request);

        static::assertFalse($valid);
    }

    public function testLegacyValidSubPathRequestCheck()
    {
        $queryParams = [
            'module' => 'Contacts',
            'action' => 'ListView'
        ];

        $serverParams = [
            'BASE' => '/suiteinstance',
            'HTTP_HOST' => 'localhost',
            'SERVER_NAME' => 'localhost',
            'REDIRECT_URL' => '/suiteinstance/',
            'REDIRECT_QUERY_STRING' => 'module=Contacts&action=ListView',
            'REQUEST_METHOD' => 'GET',
            'QUERY_STRING' => 'module=Contacts&action=ListView',
            'SCRIPT_FILENAME' => '/var/www/html/suiteinstance/index.php',
            'REQUEST_URI' => '/suiteinstance/?module=Contacts&action=ListView',
            'SCRIPT_NAME' => '/suiteinstance/index.php',
            'PHP_SELF' => '/suiteinstance/index.php'
        ];

        $request = new Request($queryParams,[],[],[],[], $serverParams);

        $valid = $this->routeConverter->isLegacyRoute($request);

        static::assertTrue($valid);
    }

    public function testLegacyValidRequestCheck()
    {
        $queryParams = [
            'module' => 'Contacts',
            'action' => 'DetailView',
            'record' => '123',
        ];

        $request = new Request($queryParams);

        $valid = $this->routeConverter->isLegacyRoute($request);

        static::assertTrue($valid);
    }

    public function testLegacyNoModuleRequestCheck()
    {
        $queryParams = [];

        $request = new Request($queryParams);

        $valid = $this->routeConverter->isLegacyRoute($request);

        static::assertFalse($valid);
    }

    public function testLegacyInvalidModuleRequestCheck()
    {
        $queryParams = [
            'module' => 'FakeModule',
        ];

        $request = new Request($queryParams);

        $valid = $this->routeConverter->isLegacyRoute($request);

        static::assertFalse($valid);
    }



    public function testLegacyInvalidActionRequestCheck()
    {
        $queryParams = [
            'module' => 'Contacts',
            'action' => 'FakeAction'
        ];

        $request = new Request($queryParams);

        $valid = $this->routeConverter->isLegacyRoute($request);

        static::assertFalse($valid);
    }

    public function testLegacyValidModuleIndexRRequest()
    {
        $resultingRoute = './#/contacts';
        $queryParams = [
            'module' => 'Contacts',
        ];
        $request = new Request($queryParams);

        $route = $this->routeConverter->convert($request);

        static::assertEquals($resultingRoute, $route);
    }

    public function testLegacyValidModuleViewRequest()
    {
        $resultingRoute = './#/contacts/list';
        $queryParams = [
            'module' => 'Contacts',
            'action' => 'ListView'
        ];

        $request = new Request($queryParams);

        $route = $this->routeConverter->convert($request);

        static::assertEquals($resultingRoute, $route);
    }

    public function testLegacyValidModuleRecordRequest()
    {
        $resultingRoute = './#/contacts/detail/123';
        $queryParams = [
            'module' => 'Contacts',
            'action' => 'DetailView',
            'record' => '123',
        ];

        $request = new Request($queryParams);

        $route = $this->routeConverter->convert($request);

        static::assertEquals($resultingRoute, $route);
    }

    public function testLegacyInvalidModuleIndexRequest()
    {
        $this->expectException(InvalidArgumentException::class);
        $queryParams = [
            'module' => 'FakeAction',
        ];

        $request = new Request($queryParams);

        $this->routeConverter->convert($request);

    }

    public function testLegacyModuleInvalidActionRequest()
    {
        $this->expectException(InvalidArgumentException::class);
        $queryParams = [
            'module' => 'Contacts',
            'action' => 'FakeAction'
        ];

        $request = new Request($queryParams);

        $this->routeConverter->convert($request);
    }

    public function testLegacyNoModuleRequest()
    {
        $this->expectException(InvalidArgumentException::class);
        $queryParams = [];

        $request = new Request($queryParams);

        $this->routeConverter->convert($request);
    }

}