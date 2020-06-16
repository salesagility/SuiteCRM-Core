<?php

namespace App\Tests;

use App\Entity\FieldDefinition;
use Codeception\Test\Unit;
use Exception;
use SuiteCRM\Core\Legacy\FieldDefinitionsHandler;
use SuiteCRM\Core\Legacy\ModuleNameMapperHandler;

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
        $moduleNameMapper = new ModuleNameMapperHandler(
            $this->tester->getProjectDir(),
            $this->tester->getLegacyDir(),
            $this->tester->getLegacySessionName(),
            $this->tester->getDefaultSessionName(),
            $this->tester->getLegacyScope()
        );

        $this->fieldDefinitionsHandler = new FieldDefinitionsHandler(
            $this->tester->getProjectDir(),
            $this->tester->getLegacyDir(),
            $this->tester->getLegacySessionName(),
            $this->tester->getDefaultSessionName(),
            $this->tester->getLegacyScope(),
            $moduleNameMapper
        );
    }

    /**
     * @throws Exception
     */
    public function testGetUserVardef(): void
    {
        $this->fieldDefinition = $this->fieldDefinitionsHandler->getVardef('accounts');

        static::assertNotNull($this->fieldDefinition);

        $vardefs = $this->fieldDefinition->vardef;
        static::assertNotNull($vardefs);
        static::assertIsArray($vardefs);
        static::assertNotEmpty($vardefs);

        $first = $vardefs['name'];
        static::assertIsArray($first);
        static::assertNotEmpty($first);

        static::assertArrayHasKey('name', $first);
        static::assertArrayHasKey('type', $first);
        static::assertArrayHasKey('dbType', $first);
        static::assertArrayHasKey('vname', $first);
        static::assertArrayHasKey('len', $first);
    }
}
