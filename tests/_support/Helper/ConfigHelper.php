<?php
namespace App\Tests\Helper;

class ConfigHelper extends \Codeception\Module
{
    public function getConfig($key)
    {
        if (isset($this->config[$key])) {
            return $this->config[$key];
        } else {
            return null;
        }
    }
}
