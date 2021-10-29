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
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */


namespace App;

use Exception;
use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\Config\Exception\LoaderLoadException;
use Symfony\Component\Config\Loader\LoaderInterface;
use Symfony\Component\Config\Resource\FileResource;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;
use Symfony\Component\Routing\RouteCollectionBuilder;
use function dirname;

/**
 * Class Kernel
 * @package App
 */
class Kernel extends BaseKernel
{
    use MicroKernelTrait;

    private const CONFIG_EXTS = '.{php,xml,yaml,yml}';

    /**
     * @return string
     */
    public function getProjectDir(): string
    {
        return dirname(__DIR__, 2);
    }

    /**
     * @return string
     */
    public function getCacheDir(): string
    {
        return dirname(__DIR__, 2) . '/cache/' . $this->environment;
    }

    /**
     * @return string
     */
    public function getLogDir(): string
    {
        return dirname(__DIR__, 2) . '/logs/' . $this->environment;
    }

    /**
     * @return iterable
     */
    public function registerBundles(): iterable
    {
        $contents = require dirname(__DIR__, 2) . '/config/bundles.php';
        foreach ($contents as $class => $envs) {
            if ($envs[$this->environment] ?? $envs['all'] ?? false) {
                yield new $class();
            }
        }
    }

    /**
     * @param ContainerBuilder $container
     * @param LoaderInterface $loader
     * @throws Exception
     */
    protected function configureContainer(ContainerBuilder $container, LoaderInterface $loader): void
    {
        $container->addResource(new FileResource(dirname(__DIR__, 2) . '/config/bundles.php'));
        $container->setParameter('container.dumper.inline_class_loader', true);
        $confDir = dirname(__DIR__, 2) . '/config';
        $loader->load($confDir . '/{packages}/*' . self::CONFIG_EXTS, 'glob');
        $loader->load($confDir . '/{packages}/' . $this->environment . '/*' . self::CONFIG_EXTS, 'glob');
        $loader->load($confDir . '/{services}' . self::CONFIG_EXTS, 'glob');
        $loader->load($confDir . '/{services}_' . $this->environment . self::CONFIG_EXTS, 'glob');
    }

    /**
     * @param RouteCollectionBuilder $routes
     * @throws LoaderLoadException
     */
    protected function configureRoutes(RouteCollectionBuilder $routes): void
    {
        $confDir = dirname(__DIR__, 2) . '/config';
        $routes->import($confDir . '/{routes}/' . $this->environment . '/*' . self::CONFIG_EXTS, '/', 'glob');
        $routes->import($confDir . '/{routes}/*' . self::CONFIG_EXTS, '/', 'glob');
        $routes->import($confDir . '/{routes}' . self::CONFIG_EXTS, '/', 'glob');
    }

    /**
     * @param Request $request
     * @return array
     */
    public function getLegacyRoute(Request $request): array
    {
        $this->initializeBundles();
        $this->initializeContainer();

        if ($this->container->has('legacy.route.handler')) {
            return $this->container->get('legacy.route.handler')->getLegacyRoute($request);
        }

        return [];
    }
}
