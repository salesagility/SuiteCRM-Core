<?php

namespace App\Tests\unit\core\legacy;

use App\Entity\FieldDefinition;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use Exception;
use App\Legacy\FieldDefinitionsHandler;
use App\Legacy\ModuleNameMapperHandler;

/**
 * Class FieldDefinitionHandlerTest
 * @package App\Tests\unit\core\legacy
 */
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
