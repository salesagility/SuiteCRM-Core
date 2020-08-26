<?php

include __DIR__.'/../vendor/autoload.php'; // composer autoload

use AspectMock\Kernel;

$kernel = Kernel::getInstance();
$kernel->init([
    'debug' => true,
    'appDir' => __DIR__ . '/..',
    'cacheDir' => __DIR__ . '/../cache/test/aop',
    'includePaths' => [
        __DIR__ . '/../core/src',
        __DIR__ . '/../core/legacy',
        __DIR__ . '/../vendor/api-platform',
    ],
    'excludePaths' => [
        __DIR__,
        '/../vendor/codeception', '/../vendor/phpunit'
    ],
]);

$kernel->loadFile(__DIR__ . '/../core/legacy/AclHandler.php');
$kernel->loadFile(__DIR__ . '/../core/legacy/Authentication.php');
$kernel->loadFile(__DIR__ . '/../vendor/api-platform/core/src/Metadata/Resource/ResourceMetadata.php');
$kernel->loadFile(__DIR__ . '/../vendor/api-platform/core/src/Util/RequestAttributesExtractor.php');
$kernel->loadFile(__DIR__ . '/../vendor/api-platform/core/src/Metadata/Resource/Factory/AnnotationResourceFilterMetadataFactory.php');
$kernel->loadFile(__DIR__ . '/../vendor/api-platform/core/src/Security/EventListener/DenyAccessListener.php');
