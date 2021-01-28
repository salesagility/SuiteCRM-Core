<?php

namespace App\Tests\unit\core\legacy\SystemConfig;

use ApiPlatform\Core\Exception\ItemNotFoundException;
use App\Legacy\ModuleNameMapperHandler;
use App\Legacy\SystemConfig\DefaultModuleConfigMapper;
use App\Legacy\SystemConfig\SystemConfigMappers;
use App\Tests\UnitTester;
use ArrayObject;
use Codeception\Test\Unit;
use Exception;

/**
 * Class SystemConfigMappersTest
 * @package App\Tests\unit\core\legacy\SystemConfig
 */
class SystemConfigMappersTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var SystemConfigMappers
     */
    protected $handler;

    /**
     * Test get existing mapper
     */
    public function testGetExistingConfigMapper(): void
    {
        $handler = $this->handler->get('default_module');
        static::assertNotNull($handler);
        static::assertEquals('default_module', $handler->getKey());
    }

    /**
     * Test get non existing mapper
     */
    public function testGetNonExistingConfigMapper(): void
    {
        try {
            $this->handler->get('test');
        } catch (ItemNotFoundException $e) {
            static::assertEquals('SystemConfig mapper is not defined', $e->getMessage());
        }
    }

    /**
     * Test get non existing mapper
     */
    public function testCheckNonExistingConfigMapper(): void
    {
        $exists = $this->handler->hasMapper('test');
        static::assertFalse($exists);
    }

    /**
     * Test get non existing mapper
     */
    public function testCheckExistingConfigMapper(): void
    {
        $exists = $this->handler->hasMapper('default_module');
        static::assertTrue($exists);
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

        $obj = new ArrayObject([
            new DefaultModuleConfigMapper($moduleNameMapper),
        ]);
        $it = $obj->getIterator();

        $this->handler = new SystemConfigMappers($it);
    }
}
