<?php

namespace App\Tests\unit\core\src\Service;

use App\Service\ModuleNameMapperInterface;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use InvalidArgumentException;
use App\Legacy\ModuleNameMapperHandler;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

/**
 * Class ModuleNameMapperTest
 * @package App\Tests
 */
class ModuleNameMapperTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleMapper;

    protected function _before(): void
    {
        $session = new Session(new MockArraySessionStorage('PHPSESSID'));
        $session->start();

        $this->moduleMapper = new ModuleNameMapperHandler(
            $this->tester->getProjectDir(),
            $this->tester->getLegacyDir(),
            $this->tester->getLegacySessionName(),
            $this->tester->getDefaultSessionName(),
            $this->tester->getLegacyScope(),
            $session
        );
    }

    /**
     * Test valid module name check with valid name
     */
    public function testValidLegacyModuleNameCheck(): void
    {
        $valid = $this->moduleMapper->isValidModule('Contacts');

        static::assertTrue($valid);
    }

    /**
     * Test valid module name check with invalid name
     */
    public function testInvalidLegacyModuleNameCheck(): void
    {
        $valid = $this->moduleMapper->isValidModule('FakeModule');

        static::assertFalse($valid);
    }

    /**
     * Test module name conversion to frontend with valid name
     */
    public function testLegacyModuleNameToFrontEndConversion(): void
    {
        $frontendName = $this->moduleMapper->toFrontEnd('Contacts');
        static::assertEquals('contacts', $frontendName);
    }

    /**
     * Test module name conversion to frontend with invalid name
     */
    public function testInvalidLegacyModuleNameToFrontEndConversion(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->moduleMapper->toFrontEnd('FakeModule');
    }

    /**
     * Test module name conversion to core with valid name
     */
    public function testLegacyModuleNameToCoreConversion(): void
    {
        $coreName = $this->moduleMapper->toCore('Contacts');
        static::assertEquals('Contacts', $coreName);
    }

    /**
     * Test module name conversion to core with invalid name
     */
    public function testInvalidLegacyModuleNameToCoreConversion(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->moduleMapper->toCore('FakeModule');
    }

}
