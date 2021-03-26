<?php
/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see http://www.gnu.org/licenses.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */


namespace App\Tests\unit\core\src\Service;

use App\Routes\Service\RouteConverterInterface;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use InvalidArgumentException;
use App\Engine\LegacyHandler\ActionNameMapperHandler;
use App\Module\LegacyHandler\ModuleNameMapperHandler;
use App\Routes\LegacyHandler\RouteConverterHandler;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

/**
 * Class RouteConverterTest
 * @package App\Tests
 */
class RouteConverterTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;


    /**
     * @var RouteConverterInterface
     */
    private $routeConverter;

    protected function _before(): void
    {
        $session = new Session(new MockArraySessionStorage('PHPSESSID'));
        $session->start();

        $projectDir = $this->tester->getProjectDir();
        $legacyDir = $this->tester->getLegacyDir();
        $legacySessionName = $this->tester->getLegacySessionName();
        $defaultSessionName = $this->tester->getDefaultSessionName();
        $legacyScope = $this->tester->getLegacyScope();

        $moduleMapper = new ModuleNameMapperHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $session
        );

        $actionMapper = new ActionNameMapperHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $session
        );

        $this->routeConverter = new RouteConverterHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $moduleMapper,
            $actionMapper,
            $session
        );
    }

    /**
     * Test check for to determine if is an API Request
     */
    public function testAPIRequestCheck(): void
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

        $request = new Request($queryParams, [], [], [], [], $serverParams);

        $valid = $this->routeConverter->isLegacyViewRoute($request);

        static::assertFalse($valid);
    }

    /**
     * Test legacy call request on instance installed in a subpath
     */
    public function testLegacyValidSubPathRequestCheck(): void
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

        $request = new Request($queryParams, [], [], [], [], $serverParams);

        $valid = $this->routeConverter->isLegacyViewRoute($request);

        static::assertTrue($valid);
    }

    /**
     * Test legacy call request check with valid request
     */
    public function testLegacyValidRequestCheck(): void
    {
        $queryParams = [
            'module' => 'Contacts',
            'action' => 'DetailView',
            'record' => '123',
        ];

        $request = new Request($queryParams);

        $valid = $this->routeConverter->isLegacyViewRoute($request);

        static::assertTrue($valid);
    }

    /**
     * Test legacy call request check with no module
     */
    public function testLegacyNoModuleRequestCheck(): void
    {
        $queryParams = [];

        $request = new Request($queryParams);

        $valid = $this->routeConverter->isLegacyViewRoute($request);

        static::assertFalse($valid);
    }

    /**
     * Test legacy call request check with invalid module
     */
    public function testLegacyInvalidModuleRequestCheck(): void
    {
        $queryParams = [
            'module' => 'FakeModule',
        ];

        $request = new Request($queryParams);

        $valid = $this->routeConverter->isLegacyViewRoute($request);

        static::assertFalse($valid);
    }

    /**
     * Test legacy call request check with invalid action
     */
    public function testLegacyInvalidActionRequestCheck(): void
    {
        $queryParams = [
            'module' => 'Contacts',
            'action' => 'FakeAction'
        ];

        $request = new Request($queryParams);

        $valid = $this->routeConverter->isLegacyViewRoute($request);

        static::assertFalse($valid);
    }

    /**
     * Test legacy call to valid module
     */
    public function testLegacyValidModuleIndexRRequest(): void
    {
        $resultingRoute = './#/contacts';
        $queryParams = [
            'module' => 'Contacts',
        ];
        $request = new Request($queryParams);

        $route = $this->routeConverter->convert($request);

        static::assertEquals($resultingRoute, $route);
    }

    /**
     * Test legacy call to valid view
     */
    public function testLegacyValidModuleViewRequest(): void
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

    /**
     * Test legacy call to module record
     */
    public function testLegacyValidModuleRecordRequest(): void
    {
        $resultingRoute = './#/contacts/record/123';
        $queryParams = [
            'module' => 'Contacts',
            'action' => 'DetailView',
            'record' => '123',
        ];

        $request = new Request($queryParams);

        $route = $this->routeConverter->convert($request);

        static::assertEquals($resultingRoute, $route);
    }

    /**
     * test legacy call to invalid module
     */
    public function testLegacyInvalidModuleIndexRequest(): void
    {
        $resultingRoute = './#/FakeModule';
        $queryParams = [
            'module' => 'FakeModule',
        ];

        $request = new Request($queryParams);

        $route = $this->routeConverter->convert($request);
        static::assertEquals($resultingRoute, $route);
    }

    /**
     * Test legacy call with invalid action
     */
    public function testLegacyModuleInvalidActionRequest(): void
    {
        $resultingRoute = './#/contacts/FakeAction';
        $queryParams = [
            'module' => 'Contacts',
            'action' => 'FakeAction'
        ];

        $request = new Request($queryParams);

        $route = $this->routeConverter->convert($request);

        static::assertEquals($resultingRoute, $route);
    }

    /**
     * Test legacy call without module
     */
    public function testLegacyNoModuleRequest(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $queryParams = [];

        $request = new Request($queryParams);

        $this->routeConverter->convert($request);
    }

}
