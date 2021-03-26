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

use App\Routes\Service\LegacyAssetRedirectHandler;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class LegacyAssetRedirectHandlerTest
 * @package App\Tests
 */
class LegacyAssetRedirectHandlerTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var LegacyAssetRedirectHandler
     */
    private $legacyAssetHandler;

    protected function _before(): void
    {
        $legacyAssetPaths = [
            'cache',
            'include',
            'themes'
        ];

        $this->legacyAssetHandler = new LegacyAssetRedirectHandler($legacyAssetPaths, '/legacy');
    }

    /**
     * Test asset path check with an api path
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

        $valid = $this->legacyAssetHandler->isAssetRequest($request);

        static::assertFalse($valid);
    }

    /**
     * Test asset path check for valid path
     */
    public function testLegacyValidAssetPathRequestCheck(): void
    {
        $queryParams = [
            'v' => 'Y0_lwfeIA-XvM4ey09-htw',
        ];

        $serverParams = [
            'BASE' => '/suiteinstance',
            'HTTP_HOST' => 'localhost',
            'SERVER_NAME' => 'localhost',
            'REDIRECT_URL' => '/suiteinstance/',
            'REDIRECT_QUERY_STRING' => 'v=Y0_lwfeIA-XvM4ey09-htw',
            'REQUEST_METHOD' => 'GET',
            'QUERY_STRING' => 'v=Y0_lwfeIA-XvM4ey09-htw',
            'SCRIPT_FILENAME' => '/var/www/html/suiteinstance/index.php',
            'REQUEST_URI' => '/suiteinstance/themes/default/images/company_logo.png?v=Y0_lwfeIA-XvM4ey09-htw',
            'SCRIPT_NAME' => '/suiteinstance/index.php',
            'PHP_SELF' => '/suiteinstance/index.php'
        ];

        $request = new Request($queryParams, [], [], [], [], $serverParams);

        $valid = $this->legacyAssetHandler->isAssetRequest($request);

        static::assertTrue($valid);
    }

    /**
     * Test asset path conversion for valid path
     */
    public function testValidLegacyAssetPathConversion(): void
    {
        $resultingRoute = '/suiteinstance/legacy/themes/default/images/company_logo.png?v=Y0_lwfeIA-XvM4ey09-htw';
        $queryParams = [
            'v' => 'Y0_lwfeIA-XvM4ey09-htw',
        ];

        $serverParams = [
            'BASE' => '/suiteinstance',
            'HTTP_HOST' => 'localhost',
            'SERVER_NAME' => 'localhost',
            'REDIRECT_URL' => '/suiteinstance/',
            'REDIRECT_QUERY_STRING' => 'v=Y0_lwfeIA-XvM4ey09-htw',
            'REQUEST_METHOD' => 'GET',
            'QUERY_STRING' => 'v=Y0_lwfeIA-XvM4ey09-htw',
            'SCRIPT_FILENAME' => '/var/www/html/suiteinstance/index.php',
            'REQUEST_URI' => '/suiteinstance/themes/default/images/company_logo.png?v=Y0_lwfeIA-XvM4ey09-htw',
            'SCRIPT_NAME' => '/suiteinstance/index.php',
            'PHP_SELF' => '/suiteinstance/index.php'
        ];

        $request = new Request($queryParams, [], [], [], [], $serverParams);

        $route = $this->legacyAssetHandler->convert($request);

        static::assertEquals($resultingRoute, $route);
    }
}
