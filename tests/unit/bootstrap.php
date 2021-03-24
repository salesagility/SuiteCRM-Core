<?php

use AspectMock\Kernel;

error_reporting(E_ALL);

$kernel = Kernel::getInstance();
$kernel->init([
    'appDir' => __DIR__ . '/../..',
    'cacheDir' => __DIR__ . '/../../cache/test/aop',
    'debug' => true,
    'includePaths' => [
        __DIR__ . '/../../core/backend',
        __DIR__ . '/../../core/legacy',
        __DIR__ . '/../../vendor/api-platform',
    ],
    'excludePaths' => [
        __DIR__,
        __DIR__ . '/..',
    ],
]);


// Bootstrap composer
require_once __DIR__ . '/../../vendor/autoload.php';

chdir(__DIR__ . '/../../public/legacy');

// Bootstrap SuiteCRM
if (!defined('sugarEntry')) {
    define('sugarEntry', true);
    define('SUITE_PHPUNIT_RUNNER', true);
}

// Load in legacy
require_once __DIR__ . '/../../public/legacy/include/utils.php';
require_once __DIR__ . '/../../public/legacy/include/modules.php';
require_once __DIR__ . '/../../public/legacy/include/MVC/preDispatch.php';
require_once __DIR__ . '/../../public/legacy/include/entryPoint.php';

$kernel->loadFile(__DIR__ . '/../_mock/Helpers/core/legacy/Data/DBQueryResultsMocking.php');
$kernel->loadPhpFiles(__DIR__ . '/../_mock/Mock');
