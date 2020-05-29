<?php

namespace App\Tests;

use App\Service\ActionNameMapperInterface;
use Codeception\Test\Unit;
use SuiteCRM\Core\Legacy\ActionNameMapperHandler;

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

    protected function _before(): void
    {
        $this->actionMapper = new ActionNameMapperHandler(
            $this->tester->getProjectDir(),
            $this->tester->getLegacyDir(),
            $this->tester->getLegacySessionName(),
            $this->tester->getDefaultSessionName(),
            $this->tester->getLegacyScope()
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
