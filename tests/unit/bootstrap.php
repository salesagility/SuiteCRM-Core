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


use AspectMock\Kernel;

error_reporting(E_ALL);

$kernel = Kernel::getInstance();
$kernel->init([
    'appDir' => __DIR__ . '/../..',
    'cacheDir' => __DIR__ . '/../../cache/test/aop',
    'debug' => true,
    'includePaths' => [
        __DIR__ . '/../../core/backend',
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
