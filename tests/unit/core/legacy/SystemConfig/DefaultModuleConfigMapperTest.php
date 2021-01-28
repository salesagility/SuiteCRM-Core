<?php

namespace App\Tests\unit\core\legacy\SystemConfig;

use App\Entity\SystemConfig;
use App\Legacy\ModuleNameMapperHandler;
use App\Legacy\SystemConfig\DefaultModuleConfigMapper;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use Exception;
use InvalidArgumentException;

/**
 * Class DefaultModuleConfigMapperTest
 * @package App\Tests\unit\core\legacy\SystemConfig
 */
class DefaultModuleConfigMapperTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var DefaultModuleConfigMapper
     */
    protected $handler;

    /**
     * Test Get Key
     */
    public function testGetKey(): void
    {
        static::assertEquals('default_module', $this->handler->getKey());
    }

    /**
     * Test empty definition
     */
    public function testEmptyConfig(): void
    {
        $config = new SystemConfig();
        $config->setValue(null);
        $this->handler->map($config);
        static::assertNull($config->getValue());
    }

    /**
     * Test mapping existing config
     */
    public function testMapExistingModule(): void
    {
        $config = new SystemConfig();
        $config->setValue('Accounts');
        $this->handler->map($config);
        static::assertEquals('accounts', $config->getValue());
    }

    /**
     * Test mapping non existing config
     */
    public function testMapNonExistingModule(): void
    {
        $config = new SystemConfig();
        $config->setValue('Test');
        try {
            $this->handler->map($config);
        } catch (InvalidArgumentException $e) {
            static::assertEquals('No mapping for Test', $e->getMessage());
        }
    }

    /**
     * @throws Exception
     */
    protected function _before(): void
    {
        $projectDir = $this->tester->getProjectDir();
        $legacyDir = $this->tester->getLegacyDir();
        $legacySessionName = $this->tester->getLegacySessionName();
        $defaultSessionName = $this->tester->getDefaultSessionName();

        $legacyScope = $this->tester->getLegacyScope();

        $moduleNameMapper = new ModuleNameMapperHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope
        );

        $this->handler = new DefaultModuleConfigMapper($moduleNameMapper);
    }
}
