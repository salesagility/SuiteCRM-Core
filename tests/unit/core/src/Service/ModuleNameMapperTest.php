<?php namespace App\Tests;

use App\Service\ModuleNameMapper;
use \Codeception\Test\Unit;
use InvalidArgumentException;

class ModuleNameMapperTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;


    /**
     * @var ModuleNameMapper
     */
    private $moduleMapper;

    protected function _before()
    {
        $legacyModuleNameMap = [
            'Contacts' => [
                'frontend' => 'contacts',
                'core' => 'Contacts'
            ],
        ];

        $this->moduleMapper = new ModuleNameMapper($legacyModuleNameMap);
    }


    public function testValidLegacyModuleNameCheck()
    {
        $valid = $this->moduleMapper->isValidModule('Contacts');

        static::assertTrue($valid);
    }

    public function testInvalidLegacyModuleNameCheck()
    {
        $valid = $this->moduleMapper->isValidModule('FakeModule');

        static::assertFalse($valid);
    }

    public function testLegacyModuleNameToFrontEndConversion()
    {
        $frontendName = $this->moduleMapper->toFrontEnd('Contacts');
        static::assertEquals('contacts', $frontendName);
    }

    public function testInvalidLegacyModuleNameToFrontEndConversion()
    {
        $this->expectException(InvalidArgumentException::class);
        $this->moduleMapper->toFrontEnd('FakeModule');
    }

    public function testLegacyModuleNameToCoreConversion()
    {
        $coreName = $this->moduleMapper->toCore('Contacts');
        static::assertEquals('Contacts', $coreName);
    }

    public function testInvalidLegacyModuleNameToCoreConversion()
    {
        $this->expectException(InvalidArgumentException::class);
        $this->moduleMapper->toCore('FakeModule');
    }

}