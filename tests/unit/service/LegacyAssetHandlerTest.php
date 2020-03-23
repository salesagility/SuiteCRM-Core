<?php namespace App\Tests;

use App\Service\LegacyAssetHandler;
use \Codeception\Test\Unit;
use Symfony\Component\HttpFoundation\Request;

class LegacyAssetHandlerTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;


    /**
     * @var LegacyAssetHandler
     */
    private $legacyAssetHandler;

    protected function _before()
    {
        $legacyAssetPaths = [
            'cache',
            'include',
            'themes'
        ];

        $this->legacyAssetHandler = new LegacyAssetHandler($legacyAssetPaths, '/legacy');
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

        $request = new Request($queryParams, [], [], [], [], $serverParams);

        $valid = $this->legacyAssetHandler->isLegacyAssetRequest($request);

        static::assertFalse($valid);
    }

    public function testLegacyValidAssetPathRequestCheck()
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

        $valid = $this->legacyAssetHandler->isLegacyAssetRequest($request);

        static::assertTrue($valid);
    }

    public function testValidLegacyAssetPathConvertion()
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