<?php

namespace SuiteCRM\Core\Base\Config\Loader;

use Exception;
use Symfony\Component\Config\Loader\FileLoader;
use Symfony\Component\Yaml\Yaml;

/**
 * Class YamlLoader
 * @package SuiteCRM\Core\Base\Config\Loader
 */
class YamlLoader extends FileLoader
{

    /**
     *
     * @param mixed $resource The resource
     * @param string|null $type The resource type or null if unknown
     * @return mixed The YAML converted to a PHP value
     * @throws Exception
     */
    public function load($resource, $type = null)
    {
        $contents = file_get_contents($resource);

        return Yaml::parse($contents);
    }

    /**
     * @param mixed $resource
     * @param null $type
     * @return bool
     */
    public function supports($resource, $type = null): bool
    {
        return is_string($resource) && 'yml' === pathinfo(
                $resource,
                PATHINFO_EXTENSION
            );
    }
}
