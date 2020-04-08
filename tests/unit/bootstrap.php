<?php

use AspectMock\Kernel;

error_reporting(E_ALL);

$kernel = Kernel::getInstance();
$kernel->init([
    'appDir' => __DIR__ . '/../..',
    'cacheDir' => __DIR__ . '/../../cache/test/aop',
    'debug' => true,
    'includePaths' => [
        __DIR__ . '/../../core/src',
        __DIR__ . '/../../core/legacy',
    ],
    'excludePaths' => [
        __DIR__,
        __DIR__ . '/..',
    ],
]);


// Bootstrap composer
require_once __DIR__ . '/../../vendor/autoload.php';

chdir(__DIR__ . '/../../legacy');

// Bootstrap SuiteCRM
if (!defined('sugarEntry')) {
    define('sugarEntry', true);
    define('SUITE_PHPUNIT_RUNNER', true);
}

// Load in legacy
require_once __DIR__ . '/../../legacy/include/utils.php';
require_once __DIR__ . '/../../legacy/include/modules.php';
require_once __DIR__ . '/../../legacy/include/MVC/preDispatch.php';
require_once __DIR__ . '/../../legacy/include/entryPoint.php';
