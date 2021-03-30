<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

use SuiteCRM\Core\Base\Config\Manager as ConfigManager;
use SuiteCRM\Core\Base\Config\ParameterCollection;

final class ConfigTest extends TestCase
{

    public function setUp()
    {
        if (!defined('BASE_PATH')) {
            define('BASE_PATH', realpath(__DIR__ . '/../../../../../'));
        }
    }

    public function testUnusableFiles(): void
    {
        $configManager = new ConfigManager();

        // Load no files
        $configParameters = $configManager->loadFiles(
            BASE_PATH . '/tests/testdata/ConfigTest/LoadSingle/config.yml'
        );

        $this->assertTrue(true);
    }

    public function testLoadFileNotFound(): void
    {
        $this->expectException('Exception');
        $this->expectExceptionMessage('Config paths need to be set up correctly');

        $configManager = new ConfigManager();

        // Loading file that does not exist
        $configParameters = $configManager->loadFiles(
            realpath(
                BASE_PATH . '/tests/testdata/ConfigTest/LoadFileNotFound/config.yml'
            )
        );
    }

    public function testLoadEmpty(): void
    {
        $configManager = new ConfigManager();

        $configParameters = $configManager->loadFiles(
            realpath(
                BASE_PATH . '/tests/testdata/ConfigTest/LoadEmpty/config.yml'
            )
        );

        $params = $configParameters->getAll();

        $this->assertCount(0, $params);
    }

    public function testLoadSingle(): void
    {
        $configManager = new ConfigManager();

        $configParameters = $configManager->loadFiles(
            realpath(
                BASE_PATH . '/tests/testdata/ConfigTest/LoadSingle/config.yml'
            )
        );

        $this->assertInstanceOf('SuiteCRM\Core\Base\Config\ParameterCollection', $configParameters);
        $this->assertTrue($configParameters->has('config.data_1'));
    }

    public function testLoadMultiple(): void
    {
        $files = [
            realpath(BASE_PATH . '/tests/testdata/ConfigTest/LoadMultiple/config_1.yml'),
            realpath(BASE_PATH . '/tests/testdata/ConfigTest/LoadMultiple/config_2.yml'),
            realpath(BASE_PATH . '/tests/testdata/ConfigTest/LoadMultiple/config_3.yml')
        ];

        $configManager = new ConfigManager();

        $configParameters = $configManager->loadFiles($files);

        $this->assertTrue($configParameters->has('config_1.data_1.param_1'));
        $this->assertTrue($configParameters->has('config_2.data_2.param_1'));
        $this->assertTrue($configParameters->has('config_3.data_1.param_3'));
    }
}
