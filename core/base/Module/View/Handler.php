<?php

namespace SuiteCRM\Core\Base\Module\View;

use \stdClass;

/**
 * Class Handler
 * @package SuiteCRM\Core\Base\Module\View
 */
class Handler
{

    /**
     * Render the view file and pass it to the templates
     *
     * @param string $filename The view files name
     * @param array $params Params to pass to view file
     * @param string $template
     * @return mixed
     */
    public function render($filename, $params = [], $template = 'default.json.php')
    {
        // Allow the view param to work with and with the .php
        $filename = (strpos($filename, '.php') !== false) ? $filename : $filename . '.php';

        $view = new stdClass();

        // Extract the parameters
        extract($params);

        if (file_exists(__DIR__ . '/template/default.json.php')) {
            require __DIR__ . '/template/default.json.php';
        } else {
            echo $body;
        }
    }

}
