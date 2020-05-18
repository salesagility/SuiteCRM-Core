<?php

namespace App\Tests;

use App\Entity\FieldDefinition;
use Codeception\Test\Unit;
use SuiteCRM\Core\Legacy\FieldDefinitionsHandler;

final class FieldDefinitionHandlerTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var FieldDefinitionsHandler
     */
    private $fieldDefinitionsHandler;

    /**
     * @var FieldDefinition
     */
    protected $fieldDefinition;

    protected function _before(): void
    {
        $this->fieldDefinitionsHandler = new FieldDefinitionsHandler(
            $this->tester->getProjectDir(),
            $this->tester->getLegacyDir(),
            $this->tester->getlegacySessionName(),
            $this->tester->getdefaultSessionName(),
            $this->tester->getLegacyScope()
        );
    }

    public function testGetUserVardef(): void
    {
        $this->fieldDefinition = $this->fieldDefinitionsHandler->getVardef('Accounts');
        $output = $this->fieldDefinition->vardef;

        static::assertCount(
            1, $output
        );
    }
}
