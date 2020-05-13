<?php namespace App\Tests;

use App\Service\ActionNameMapperInterface;
use \Codeception\Test\Unit;
use SuiteCRM\Core\Legacy\ActionNameMapperHandler;
use SuiteCRM\Core\Legacy\LegacyScopeState;

class ActionNameMapperTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;


    /**
     * @var ActionNameMapperInterface
     */
    private $actionMapper;

    protected function _before()
    {
        $projectDir = codecept_root_dir();
        $legacyDir = $projectDir . '/legacy';
        $legacySessionName = 'LEGACYSESSID';
        $defaultSessionName = 'PHPSESSID';

        $legacyScope = new LegacyScopeState();

        $this->actionMapper = new ActionNameMapperHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope
        );
    }

    /**
     * Test action name check with the valid name
     */
    public function testValidLegacyActionNameCheck(): void
    {
        $valid = $this->actionMapper->isValidAction('DetailView');

        static::assertTrue($valid);
    }

    /**
     * Test action name check with the invalid name
     */
    public function testInvalidLegacyActionNameCheck(): void
    {
        $valid = $this->actionMapper->isValidAction('FakeAction');
        static::assertFalse($valid);
    }

    /**
     * Test action name to frontend mapping with the valid name
     */
    public function testLegacyActionNameToFrontEndConversion(): void
    {
        $frontendName = $this->actionMapper->toFrontEnd('DetailView');
        static::assertEquals('record', $frontendName);
    }

    /**
     * Test action name to frontend mapping with the invalid name
     */
    public function testInvalidLegacyActionNameToFrontEndConversion(): void
    {
        $action = $this->actionMapper->toFrontEnd('FakeAction');
        static::assertEquals('FakeAction', $action);
    }

    /**
     * Test action name to legacy mapping with the valid name
     */
    public function testLegacyActionNameToLegacyConversion(): void
    {
        $legacyName = $this->actionMapper->toLegacy('record');
        static::assertEquals('DetailView', $legacyName);
    }

    /**
     * Test action name to legacy mapping with the invalid name
     */
    public function testInvalidLegacyActionNameToLegacyConversion(): void
    {
        $action = $this->actionMapper->toLegacy('fake-action');
        static::assertEquals('fake-action', $action);
    }

}