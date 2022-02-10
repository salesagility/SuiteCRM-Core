<?php

use App\Kernel;
use Symfony\Component\ErrorHandler\Debug;
use Symfony\Component\HttpFoundation\Request;

require __DIR__ . '/../config/bootstrap.php';

if ($_SERVER['APP_DEBUG']) {
    umask(0000);

    Debug::enable();
}

if ($trustedProxies = $_SERVER['TRUSTED_PROXIES'] ?? $_ENV['TRUSTED_PROXIES'] ?? false) {
    Request::setTrustedProxies(
        explode(',', $trustedProxies),
        Request::HEADER_X_FORWARDED_ALL ^ Request::HEADER_X_FORWARDED_HOST
    );
}

if ($trustedHosts = $_SERVER['TRUSTED_HOSTS'] ?? $_ENV['TRUSTED_HOSTS'] ?? false) {
    Request::setTrustedHosts([$trustedHosts]);
}

// Get the autoloader class
require __DIR__ . '/../vendor/autoload.php';

$kernel = new Kernel($_SERVER['APP_ENV'], (bool)$_SERVER['APP_DEBUG']);
$request = Request::createFromGlobals();

global $legacyRoute;

$legacyRoute = $kernel->getLegacyRoute($request);

if (!empty($legacyRoute)) {

    $path = './legacy';
    if (!empty($legacyRoute['dir'])) {
        $path .= '/' . $legacyRoute['dir'];
    }

    chdir($path);

    $access = $legacyRoute['access'] ?? false;
    if ($access === false) {
        http_response_code(404);
        exit;
    }

    if (file_exists($legacyRoute['file'])) {

        /* @noinspection PhpIncludeInspection */
        require $legacyRoute['file'];
    } else {

        http_response_code(404);
        exit;
    }

} else {
    $response = $kernel->handle($request);
    $response->send();
    $kernel->terminate($request, $response);
}
