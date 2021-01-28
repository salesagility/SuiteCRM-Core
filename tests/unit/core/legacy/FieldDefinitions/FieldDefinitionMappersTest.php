<?php

namespace App\Tests\unit\core\legacy\FieldDefinitions;

use App\Legacy\FieldDefinitions\FieldDefinitionMapperInterface;
use App\Legacy\FieldDefinitions\FieldDefinitionMappers;
use App\Legacy\FieldDefinitions\GroupedFieldDefinitionMapper;
use App\Legacy\FieldDefinitions\LegacyGroupedFieldDefinitionMapper;
use App\Tests\UnitTester;
use ArrayObject;
use Codeception\Test\Unit;
use Exception;

/**
 * Class FieldDefinitionMappersTest
 * @package App\Tests\unit\core\legacy\FieldDefinitions
 */
class FieldDefinitionMappersTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var FieldDefinitionMappers
     */
    protected $handler;

    /**
     * Test retrieving the list of handlers for modules with no override
     */
    public function testGetHandlersForModuleWithNoOverrides(): void
    {
        $handlers = $this->handler->get('contacts');
        static::assertCount(2, $handlers);
    }

    /**
     * Test retrieving the list of handlers for modules with overrides
     */
    public function testGetHandlersForModuleWithOverrides(): void
    {
        $handlers = $this->handler->get('accounts');
        static::assertCount(3, $handlers);
    }

    /**
     * Test retrieving the default list of handlers
     */
    public function testGetDefaultHandlers(): void
    {
        $handlers = $this->handler->get('default');
        static::assertCount(2, $handlers);
    }

    /**
     * @throws Exception
     */
    protected function _before(): void
    {
        /** @var FieldDefinitionMapperInterface $mockAccountsMapper */
        $mockAccountsMapper = $this->makeEmpty(
            FieldDefinitionMapperInterface::class,
            [
                'getKey' => static function (): string {
                    return 'mock-mapper';
                },
                'getModule' => static function (): string {
                    return 'accounts';
                },
            ]
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
            new LegacyGroupedFieldDefinitionMapper(),
            $mockAccountsMapper
        ]);
        $it = $obj->getIterator();

        $this->handler = new FieldDefinitionMappers($it);
    }
}
