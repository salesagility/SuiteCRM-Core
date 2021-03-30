<?php

namespace SuiteCRM\Core\Base\Config;

use SuiteCRM\Core\Base\Config\Loader\YamlLoader;
use SuiteCRM\Core\Base\Helper\Data\CollectionInterface;
use SuiteCRM\Core\Base\Helper\File\FileMapperInterface;
use SuiteCRM\Core\Base\Config\ParameterCollection;

use Symfony\Component\Config\Loader\LoaderResolver;
use Symfony\Component\Config\Loader\DelegatingLoader;
use Symfony\Component\Config\FileLocator;

/**
 * Class Manager
 * @package SuiteCRM\Core\Base\Config
 */
class Manager implements FileMapperInterface
{
    /**
     *  Load the current configuration files
     *
     * @param bool $config_paths The config paths to load resources
     * @return CollectionInterface
     * @throws \Exception
     */
    public function loadFiles($config_paths = false): CollectionInterface
    {
        if ($config_paths === false) {
            throw new \RuntimeException('Config paths need to be set up correctly');
        }

        // Get array from config paths
        $configPaths = (array)$config_paths;

        $fileLocator = new FileLocator($configPaths);

        // Check paths exists
        foreach ($configPaths as $path) {
            $fileLocator->locate($path);
        }

        $loaderResolver = new LoaderResolver([new YamlLoader($fileLocator)]);

        $delegatingLoader = new DelegatingLoader($loaderResolver);

        // All config parameters
        $allParameters = [];

        if ($configPaths !== false) {
            foreach ($configPaths as $path) {
                // Load the parameters from the path resource
                $parameters = $delegatingLoader->load($path);

                // Merge parameters together
                if (!empty($parameters)) {
                    $allParameters = array_merge($allParameters, $parameters);
                }
            }
        }

        return new ParameterCollection($allParameters);
    }
}

