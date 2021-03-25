<?php

namespace App\Tests\unit\core\legacy;

use App\FieldDefinitions\Entity\FieldDefinition;
use App\Legacy\FieldDefinitions\FieldDefinitionMappers;
use App\Legacy\FieldDefinitions\GroupedFieldDefinitionMapper;
use App\Legacy\FieldDefinitions\LegacyGroupedFieldDefinitionMapper;
use App\Legacy\FieldDefinitionsHandler;
use App\Legacy\ModuleNameMapperHandler;
use App\Tests\UnitTester;
use ArrayObject;
use Codeception\Test\Unit;
use Exception;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

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
        $session = new Session(new MockArraySessionStorage('PHPSESSID'));
        $session->start();

        $moduleNameMapper = new ModuleNameMapperHandler(
            $this->tester->getProjectDir(),
            $this->tester->getLegacyDir(),
            $this->tester->getLegacySessionName(),
            $this->tester->getDefaultSessionName(),
            $this->tester->getLegacyScope(),
            $session
        );

        $groupedFieldTypesMap = [
            'address' => [
                'layout' => [
                    'street',
                    'postalcode',
                    'city',
                    'state',
                    'country'
                ],
                'display' => 'vertical',
                'showLabel' => ['edit']
            ]
        ];

        $groupedFieldMapper = new GroupedFieldDefinitionMapper($groupedFieldTypesMap);


        $obj = new ArrayObject([
            $groupedFieldMapper,
            new LegacyGroupedFieldDefinitionMapper()
        ]);
        $it = $obj->getIterator();

        $fieldDefinitionMapper = new FieldDefinitionMappers($it);

        $this->fieldDefinitionsHandler = new FieldDefinitionsHandler(
            $this->tester->getProjectDir(),
            $this->tester->getLegacyDir(),
            $this->tester->getLegacySessionName(),
            $this->tester->getDefaultSessionName(),
            $this->tester->getLegacyScope(),
            $moduleNameMapper,
            $fieldDefinitionMapper,
            $session
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
