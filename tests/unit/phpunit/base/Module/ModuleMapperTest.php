<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use SuiteCRM\Core\Base\Config\Manager as ConfigManager;
use SuiteCRM\Core\Base\Module\ModuleMapper;
use SuiteCRM\Core\Modules\Users\Users;

final class ModuleMapperTest extends TestCase
{
    protected $fileHelper;

    public function setUp()
    {
        // Get the Application Path

        // Get the Base Path
        if (!defined('BASE_PATH')) {
            define('BASE_PATH', dirname(__DIR__, 5) . '/');
        }

        // Get the Application Path
        if (!defined('APP_PATH')) {
            define('APP_PATH', BASE_PATH . '/core/modules');
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
            BASE_PATH . '/core/modules'
        ];

        $moduleMapper = new ModuleMapper($filePaths, $this->fileHelper, $configParameters);

        $this->assertCount(1, $moduleMapper->checkModulesExist(['Users']));
    }

    public function testGetModuleClassesFromFileName(): void
    {
        $config = new ConfigManager();

        $configParameters = $config->loadFiles(
            [
                BASE_PATH . '/tests/testdata/ModuleMapper/config.yml'
            ]
        );

        $filePaths = [BASE_PATH . '/core/modules'];

        $moduleMapper = new ModuleMapper($filePaths, $this->fileHelper, $configParameters);

        $moduleClasses = $moduleMapper->getModuleClassesFromFileName(
            [
                realpath(BASE_PATH . '/core/modules/Users/Users.php')
            ]
        );

        $this->assertInstanceOf(Users::class, $moduleClasses[0]);
    }
}