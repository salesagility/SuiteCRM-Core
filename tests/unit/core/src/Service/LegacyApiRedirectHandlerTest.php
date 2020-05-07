<?php namespace App\Tests;

use App\Service\LegacyApiRedirectHandler;
use Codeception\Test\Unit;
use Symfony\Component\HttpFoundation\Request;

class LegacyApiRedirectHandlerTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;


    /**
     * @var LegacyApiRedirectHandler
     */
    private $legacyApiHandler;

    protected function _before(): void
    {
        $legacyAssetPaths = [
            'Api/access_token' => 'Api/index.php/access_token',
            'Api/V8' => 'Api/index.php/V8',
            'Api' => 'Api/index.php',
            'service/v4_1' => 'service/v4_1'
        ];

        $this->legacyApiHandler = new LegacyApiRedirectHandler($legacyAssetPaths, '/legacy');
    }

    /**
     * Test api request check with suite 8 api call
     */
    public function testAPIRequestCheckWithSuite8Call(): void
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

        $valid = $this->legacyApiHandler->isApiRequest($request);

        static::assertFalse($valid);
    }

    /**
     * Test valid legacy api call check
     */
    public function testValidLegacyApiPathRequestCheck(): void
    {
        $queryParams = [
        ];

        $serverParams = [
            'BASE' => '/suiteinstance',
            'HTTP_HOST' => 'localhost',
            'SERVER_NAME' => 'localhost',
            'REDIRECT_URL' => '/suiteinstance/',
            'REDIRECT_QUERY_STRING' => '',
            'REQUEST_METHOD' => 'GET',
            'QUERY_STRING' => '',
            'SCRIPT_FILENAME' => '/var/www/html/suiteinstance/index.php',
            'REQUEST_URI' => '/suiteinstance/Api/access_token',
            'SCRIPT_NAME' => '/suiteinstance/index.php',
            'PHP_SELF' => '/suiteinstance/index.php'
        ];

        $request = new Request($queryParams, [], [], [], [], $serverParams);

        $valid = $this->legacyApiHandler->isApiRequest($request);

        static::assertTrue($valid);
    }

    /**
     * Test valid legacy api call path conversion
     */
    public function testValidLegacyApiPathConversion(): void
    {
        $resultingRoute = '/suiteinstance/legacy/Api/index.php/access_token';
        $queryParams = [
        ];

        $serverParams = [
            'BASE' => '/suiteinstance',
            'HTTP_HOST' => 'localhost',
            'SERVER_NAME' => 'localhost',
            'REDIRECT_URL' => '/suiteinstance/',
            'REDIRECT_QUERY_STRING' => '',
            'REQUEST_METHOD' => 'GET',
            'QUERY_STRING' => '',
            'SCRIPT_FILENAME' => '/var/www/html/suiteinstance/index.php',
            'REQUEST_URI' => '/suiteinstance/Api/access_token',
            'SCRIPT_NAME' => '/suiteinstance/index.php',
            'PHP_SELF' => '/suiteinstance/index.php'
        ];

        $request = new Request($queryParams, [], [], [], [], $serverParams);

        $route = $this->legacyApiHandler->convert($request);

        static::assertEquals($resultingRoute, $route);
    }
}
