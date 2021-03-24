<?php

include __DIR__.'/../vendor/autoload.php'; // composer autoload

use AspectMock\Kernel;

$kernel = Kernel::getInstance();
$kernel->init([
    'debug' => true,
    'appDir' => __DIR__ . '/..',
    'cacheDir' => __DIR__ . '/../cache/test/aop',
    'includePaths' => [
        __DIR__ . '/../core/backend',
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
$kernel->loadFile(__DIR__ . '/../vendor/api-platform/core/backend/Metadata/Resource/ResourceMetadata.php');
$kernel->loadFile(__DIR__ . '/../vendor/api-platform/core/backend/Util/RequestAttributesExtractor.php');
$kernel->loadFile(__DIR__ . '/../vendor/api-platform/core/backend/Metadata/Resource/Factory/AnnotationResourceFilterMetadataFactory.php');
$kernel->loadFile(__DIR__ . '/../vendor/api-platform/core/backend/Security/EventListener/DenyAccessListener.php');
