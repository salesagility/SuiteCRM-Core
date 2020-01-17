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
        $resultingRoute = '/#/contacts/detail/123';
        $queryParams = [];

        $request = new Request($queryParams);

        $valid = $this->routeConverter->isLegacyRoute($request);

        static::assertFalse($valid);
    }

    public function testLegacyInvalidModuleRequestCheck()
    {
        $resultingRoute = '/#/contacts/detail/123';
        $queryParams = [
            'module' => 'FakeModule',
        ];

        $request = new Request($queryParams);

        $valid = $this->routeConverter->isLegacyRoute($request);

        static::assertFalse($valid);
    }



    public function testLegacyInvalidActionRequestCheck()
    {
        $resultingRoute = '/#/contacts/detail/123';
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
        $resultingRoute = '/#/contacts';
        $queryParams = [
            'module' => 'Contacts',
        ];
        $request = new Request($queryParams);

        $route = $this->routeConverter->convert($request);

        static::assertEquals($resultingRoute, $route);
    }

    public function testLegacyValidModuleViewRequest()
    {
        $resultingRoute = '/#/contacts/list';
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
        $resultingRoute = '/#/contacts/detail/123';
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