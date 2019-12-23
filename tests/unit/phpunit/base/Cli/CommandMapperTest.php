<?php

declare(strict_types=1);

use PHPUnit\Framework\Error\Error;
use PHPUnit\Framework\TestCase;
use SuiteCRM\Core\Base\Cli\CommandMapper;

final class CommandMapperTest extends TestCase
{
    protected $commandMapper;

    protected $file;

    protected $configParameters;

    public function setUp()
    {
        // Get the Base Path
        if (!defined('BASE_PATH')) {
            define('BASE_PATH', realpath(__DIR__ . '/../../../../../'));
        }

        // Get the Application Path
        if (!defined('APP_PATH')) {
            define('APP_PATH', BASE_PATH . '/modules');
        }

        $this->file = new SuiteCRM\Core\Base\Helper\File\File();

        $this->configParameters = new SuiteCRM\Core\Base\Config\Manager();
    }

    public function testCommandMapper(): void
    {
        $configPath = BASE_PATH . '/tests/testdata/CommandMapperTest/config.yml';

        $this->commandMapper = new CommandMapper($this->file, $this->configParameters, $configPath);

        $this->assertInstanceOf(CommandMapper::class, $this->commandMapper);
    }

    public function testCommandMapperWithoutConfig(): void
    {
        $this->expectException(Error::class);

        $configPath = '';

        $this->commandMapper = new CommandMapper($this->file, $this->configParameters, $configPath);
    }

    public function testGetAllCommands(): void
    {
        $configPath = BASE_PATH . '/tests/testdata/CommandMapperTest/config.yml';

        $this->commandMapper = new CommandMapper($this->file, $this->configParameters, $configPath);

        $this->assertInstanceOf(CommandMapper::class, $this->commandMapper);

        $modules = $this->commandMapper->getAllCommands();

        $this->assertTrue(true);
    }

    public function testNoEnabledModulesWithinConfig(): void
    {
        $configPath = BASE_PATH . '/tests/testdata/CommandMapperTest/noenabledmodules.config.yml';

        $this->commandMapper = new CommandMapper($this->file, $this->configParameters, $configPath);

        $this->assertInstanceOf(CommandMapper::class, $this->commandMapper);

        $modules = $this->commandMapper->getAllCommands();

        $this->assertTrue(true);
    }
}