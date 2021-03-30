<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

use SuiteCRM\Core\Base\Module\ModuleMapper;

use SuiteCRM\Core\Base\Config\Manager as ConfigManager;
use SuiteCRM\Core\Base\Config\ParameterCollection;

final class ModuleMapperTest extends TestCase
{
    protected $fileHelper;

    public function setUp()
    {
        // Get the Application Path

        // Get the Base Path
        if (!defined('BASE_PATH')) {
            define('BASE_PATH', __DIR__ . '/../../../../../');
        }

        // Get the Application Path
        if (!defined('APP_PATH')) {
            define('APP_PATH', BASE_PATH . '/modules');
        }

        $this->fileHelper = new SuiteCRM\Core\Base\Helper\File\File();
    }

    public function testCheckModulesExist(): void
    {
        $config = new ConfigManager();

        $configParameters = $config->loadFiles(
            [
                BASE_PATH . '/tests/testdata/ModuleMapper/config.yml'
            ]
        );

        $filePaths = [
            __DIR__ . '/../../../../../modules'
        ];

        $moduleMapper = new ModuleMapper($filePaths, $this->fileHelper, $configParameters);

        $this->assertCount(1, count($moduleMapper->checkModulesExist(['Users'])));
    }

    public function testGetModuleClassesFromFileName(): void
    {
        $config = new ConfigManager();

        $configParameters = $config->loadFiles(
            [
                BASE_PATH . '/tests/testdata/ModuleMapper/config.yml'
            ]
        );

        $filePaths = [
            __DIR__ . '/../../../../../modules'
        ];

        $moduleMapper = new ModuleMapper($filePaths, $this->fileHelper, $configParameters);

        $moduleClasses = $moduleMapper->getModuleClassesFromFileName(
            [
                realpath(__DIR__ . '/../../../../../modules/Users/Users.php')
            ]
        );

        $this->assertInstanceOf('SuiteCRM\Core\Modules\Users\Users', $moduleClasses[0]);
    }
}