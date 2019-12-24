<?php

if (empty($_GET)) {
    if (!file_exists('public/index.html')) {
        throw new RuntimeException('Please run bin/cli frontend:rebuild from terminal');
    }

    include __DIR__ . '/public/index.html';
    die();
}

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

// Get the Application Path
define('BASE_PATH', __DIR__);
define('APP_PATH', __DIR__ . '/core/modules/');
define('LEGACY_PATH', __DIR__ . '/legacy/');

// Get the autoloader class
require BASE_PATH . '/vendor/autoload.php';

$config = new SuiteCRM\Core\Base\Config\Manager();

try {
    $configParameters = $config->loadFiles(
        [
            BASE_PATH . '/config/config.yml',
            BASE_PATH . '/core/base/Config/modules.config.yml',
            BASE_PATH . '/core/base/Config/services.config.yml',
        ]
    );
} catch (Exception $e) {
    trigger_error('Config failed to load files: ' . $e);
}

$request = new SuiteCRM\Core\Base\Http\Request(
    $_GET,
    $_POST,
    [],
    $_COOKIE,
    $_FILES,
    $_SERVER
);

$response = new SuiteCRM\Core\Base\Http\Response();
$fileHelper = new SuiteCRM\Core\Base\Helper\File\File();

$moduleManager = new SuiteCRM\Core\Base\Module\Manager($configParameters, $fileHelper);
$router = new SuiteCRM\Core\Base\Route\DefaultRouter($request, $configParameters);
try {
    $route = $router->load();
} catch (Exception $e) {
    trigger_error('Router failed to load: ' . $e);
}

// Create an Instance of SuiteCRM
$instance = new SuiteCRM\Core\Base\Instance($configParameters, $route, $moduleManager);

// Run the Application
$route = $instance->run()->getRoute();

$view = new SuiteCRM\Core\Base\Module\View\Handler();

$serviceMapper = new SuiteCRM\Core\Base\Module\Service\ServiceMapper($fileHelper, $moduleManager, $configParameters);

$services = $serviceMapper->getAllServices();

$controller = new $route->controller($configParameters, $request, $response, $view, $services);

$customController = 'Custom\\' . $route->controller;

// Check the custom
if (class_exists($customController)) {
    $controller = new $customController();
}

$params = [];

call_user_func_array([$controller, $route->action], $params);
