<?php

use App\Kernel;

require_once dirname(__DIR__) . '/vendor/autoload_runtime.php';

if (!file_exists('legacy/config.php') && !file_exists('../.installed_checked') && !file_exists('../.curl_check_main_page')){
    header('Location: install.php');
    return;
}

return function (array $context) {
    return new Kernel($context['APP_ENV'], (bool)$context['APP_DEBUG']);
};
