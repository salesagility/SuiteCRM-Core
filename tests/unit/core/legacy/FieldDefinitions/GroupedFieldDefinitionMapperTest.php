<?php

namespace App\Tests\unit\core\legacy\FieldDefinitions;

use App\FieldDefinitions\Entity\FieldDefinition;
use App\FieldDefinitions\LegacyHandler\GroupedFieldDefinitionMapper;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use Exception;

/**
 * Class GroupedFieldsMapperTest
 * @package App\Tests\unit\core\legacy\FieldDefinitions
 */
class GroupedFieldDefinitionMapperTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var GroupedFieldDefinitionMapper
     */
    protected $handler;

    /**
     * Test Get Key
     */
    public function testGetKey(): void
    {
        static::assertEquals('grouped-fields', $this->handler->getKey());
    }

    /**
     * Test Get Module
     */
    public function testGetModule(): void
    {
        static::assertEquals('default', $this->handler->getModule());
    }

    /**
     * Test empty definition
     */
    public function testEmptyDefinition(): void
    {
        $definition = new FieldDefinition();
        $definition->setVardef([]);
        $this->handler->map($definition);
        static::assertEquals([], $definition->getVardef());
    }

    /**
     * Test defining non declared field
     */
    public function testNonDeclaredField(): void
    {
        $definition = new FieldDefinition();
        $definition->setVardef([
            'billing_address' => [
                'name' => 'billing_address',
                'vname' => 'LBL_BILLING_ADDRESS',
                'type' => 'grouped-field',
                'groupFields' => [
                    'billing_address_street',
                    'billing_address_city',
                    'billing_address_state'
                ],
                'display' => 'inline',
            ],
            'billing_address_street' => [
                'name' => 'billing_address_street',
                'vname' => 'LBL_BILLING_ADDRESS_STREET',
                'type' => 'varchar',
                'len' => '150',
                'comment' => 'The street address used for billing address',
                'group' => 'billing_address',
                'merge_filter' => 'enabled',
            ],
            'billing_address_city' => [
                'name' => 'billing_address_city',
                'vname' => 'LBL_BILLING_ADDRESS_CITY',
                'type' => 'varchar',
                'len' => '100',
                'comment' => 'The city used for billing address',
                'group' => 'billing_address',
                'merge_filter' => 'enabled',
            ]
        ]);

        $this->handler->map($definition);

        static::assertEquals([
            'billing_address_street' => [
                'name' => 'billing_address_street',
                'vname' => 'LBL_BILLING_ADDRESS_STREET',
                'type' => 'varchar',
                'len' => '150',
                'comment' => 'The street address used for billing address',
                'group' => 'billing_address',
                'merge_filter' => 'enabled',
            ],
            'billing_address_city' => [
                'name' => 'billing_address_city',
                'vname' => 'LBL_BILLING_ADDRESS_CITY',
                'type' => 'varchar',
                'len' => '100',
                'comment' => 'The city used for billing address',
                'group' => 'billing_address',
                'merge_filter' => 'enabled',
            ],
            'billing_address' => [
                'name' => 'billing_address',
                'vname' => 'LBL_BILLING_ADDRESS',
                'type' => 'grouped-field',
                'display' => 'inline',
                'layout' => [
                    'billing_address_street',
                    'billing_address_city'
                ],
                'groupFields' => [
                    'billing_address_street' => [
                        'name' => 'billing_address_street',
                        'vname' => 'LBL_BILLING_ADDRESS_STREET',
                        'type' => 'varchar',
                        'len' => '150',
                        'comment' => 'The street address used for billing address',
                        'group' => 'billing_address',
                        'merge_filter' => 'enabled',
                    ],
                    'billing_address_city' => [
                        'name' => 'billing_address_city',
                        'vname' => 'LBL_BILLING_ADDRESS_CITY',
                        'type' => 'varchar',
                        'len' => '100',
                        'comment' => 'The city used for billing address',
                        'group' => 'billing_address',
                        'merge_filter' => 'enabled',
                    ],
                ]
            ]
        ], $definition->getVardef());
    }

    /**
     * Test Group definition mapping
     */
    public function testGroupDefinitionMapping(): void
    {
        $definition = new FieldDefinition();
        $definition->setVardef([
            'industry' => [
                'name' => 'industry',
                'vname' => 'LBL_INDUSTRY',
                'type' => 'enum',
                'options' => 'industry_dom',
                'len' => 50,
                'comment' => 'The company belongs in this industry',
                'merge_filter' => 'enabled',
            ],
            'billing_address' => [
                'name' => 'billing_address',
                'vname' => 'LBL_BILLING_ADDRESS',
                'type' => 'grouped-field',
                'groupFields' => [
                    'billing_address_street',
                    'billing_address_city',
                    'billing_address_state'
                ],
                'display' => 'inline',
                'layout' => [
                    'billing_address_street',
                    'billing_address_state',
                    'billing_address_city'
                ]
            ],
            'billing_address_street' => [
                'name' => 'billing_address_street',
                'vname' => 'LBL_BILLING_ADDRESS_STREET',
                'type' => 'varchar',
                'len' => '150',
                'comment' => 'The street address used for billing address',
                'group' => 'billing_address',
                'merge_filter' => 'enabled',
            ],
            'billing_address_city' => [
                'name' => 'billing_address_city',
                'vname' => 'LBL_BILLING_ADDRESS_CITY',
                'type' => 'varchar',
                'len' => '100',
                'comment' => 'The city used for billing address',
                'group' => 'billing_address',
                'merge_filter' => 'enabled',
            ],
            'billing_address_state' => [
                'name' => 'billing_address_state',
                'vname' => 'LBL_BILLING_ADDRESS_STATE',
                'type' => 'varchar',
                'len' => '100',
                'group' => 'billing_address',
                'comment' => 'The state used for billing address',
                'merge_filter' => 'enabled',
            ],
        ]);

        $this->handler->map($definition);

        static::assertEquals([
            'industry' => [
                'name' => 'industry',
                'vname' => 'LBL_INDUSTRY',
                'type' => 'enum',
                'options' => 'industry_dom',
                'len' => 50,
                'comment' => 'The company belongs in this industry',
                'merge_filter' => 'enabled',
            ],
            'billing_address_street' => [
                'name' => 'billing_address_street',
                'vname' => 'LBL_BILLING_ADDRESS_STREET',
                'type' => 'varchar',
                'len' => '150',
                'comment' => 'The street address used for billing address',
                'group' => 'billing_address',
                'merge_filter' => 'enabled',
            ],
            'billing_address_city' => [
                'name' => 'billing_address_city',
                'vname' => 'LBL_BILLING_ADDRESS_CITY',
                'type' => 'varchar',
                'len' => '100',
                'comment' => 'The city used for billing address',
                'group' => 'billing_address',
                'merge_filter' => 'enabled',
            ],
            'billing_address_state' => [
                'name' => 'billing_address_state',
                'vname' => 'LBL_BILLING_ADDRESS_STATE',
                'type' => 'varchar',
                'len' => '100',
                'group' => 'billing_address',
                'comment' => 'The state used for billing address',
                'merge_filter' => 'enabled',
            ],
            'billing_address' => [
                'name' => 'billing_address',
                'vname' => 'LBL_BILLING_ADDRESS',
                'type' => 'grouped-field',
                'display' => 'inline',
                'layout' => [
                    'billing_address_street',
                    'billing_address_state',
                    'billing_address_city'
                ],
                'groupFields' => [
                    'billing_address_street' => [
                        'name' => 'billing_address_street',
                        'vname' => 'LBL_BILLING_ADDRESS_STREET',
                        'type' => 'varchar',
                        'len' => '150',
                        'comment' => 'The street address used for billing address',
                        'group' => 'billing_address',
                        'merge_filter' => 'enabled',
                    ],
                    'billing_address_city' => [
                        'name' => 'billing_address_city',
                        'vname' => 'LBL_BILLING_ADDRESS_CITY',
                        'type' => 'varchar',
                        'len' => '100',
                        'comment' => 'The city used for billing address',
                        'group' => 'billing_address',
                        'merge_filter' => 'enabled',
                    ],
                    'billing_address_state' => [
                        'name' => 'billing_address_state',
                        'vname' => 'LBL_BILLING_ADDRESS_STATE',
                        'type' => 'varchar',
                        'len' => '100',
                        'group' => 'billing_address',
                        'comment' => 'The state used for billing address',
                        'merge_filter' => 'enabled',
                    ],
                ]
            ]
        ], $definition->getVardef());
    }

    /**
     * Test Group definition mapping
     */
    public function testDefaultDisplay(): void
    {
        $definition = new FieldDefinition();
        $definition->setVardef([
            'industry' => [
                'name' => 'industry',
                'vname' => 'LBL_INDUSTRY',
                'type' => 'enum',
                'options' => 'industry_dom',
                'len' => 50,
                'comment' => 'The company belongs in this industry',
                'merge_filter' => 'enabled',
            ],
            'billing_address' => [
                'name' => 'billing_address',
                'vname' => 'LBL_BILLING_ADDRESS',
                'type' => 'grouped-field',
                'groupFields' => [
                    'billing_address_street',
                    'billing_address_city',
                    'billing_address_state'
                ],
                'layout' => [
                    'billing_address_street',
                    'billing_address_state',
                    'billing_address_city'
                ]
            ],
            'billing_address_street' => [
                'name' => 'billing_address_street',
                'vname' => 'LBL_BILLING_ADDRESS_STREET',
                'type' => 'varchar',
                'len' => '150',
                'comment' => 'The street address used for billing address',
                'group' => 'billing_address',
                'merge_filter' => 'enabled',
            ],
            'billing_address_city' => [
                'name' => 'billing_address_city',
                'vname' => 'LBL_BILLING_ADDRESS_CITY',
                'type' => 'varchar',
                'len' => '100',
                'comment' => 'The city used for billing address',
                'group' => 'billing_address',
                'merge_filter' => 'enabled',
            ],
            'billing_address_state' => [
                'name' => 'billing_address_state',
                'vname' => 'LBL_BILLING_ADDRESS_STATE',
                'type' => 'varchar',
                'len' => '100',
                'group' => 'billing_address',
                'comment' => 'The state used for billing address',
                'merge_filter' => 'enabled',
            ],
        ]);

        $this->handler->map($definition);

        static::assertEquals([
            'industry' => [
                'name' => 'industry',
                'vname' => 'LBL_INDUSTRY',
                'type' => 'enum',
                'options' => 'industry_dom',
                'len' => 50,
                'comment' => 'The company belongs in this industry',
                'merge_filter' => 'enabled',
            ],
            'billing_address_street' => [
                'name' => 'billing_address_street',
                'vname' => 'LBL_BILLING_ADDRESS_STREET',
                'type' => 'varchar',
                'len' => '150',
                'comment' => 'The street address used for billing address',
                'group' => 'billing_address',
                'merge_filter' => 'enabled',
            ],
            'billing_address_city' => [
                'name' => 'billing_address_city',
                'vname' => 'LBL_BILLING_ADDRESS_CITY',
                'type' => 'varchar',
                'len' => '100',
                'comment' => 'The city used for billing address',
                'group' => 'billing_address',
                'merge_filter' => 'enabled',
            ],
            'billing_address_state' => [
                'name' => 'billing_address_state',
                'vname' => 'LBL_BILLING_ADDRESS_STATE',
                'type' => 'varchar',
                'len' => '100',
                'group' => 'billing_address',
                'comment' => 'The state used for billing address',
                'merge_filter' => 'enabled',
            ],
            'billing_address' => [
                'name' => 'billing_address',
                'vname' => 'LBL_BILLING_ADDRESS',
                'type' => 'grouped-field',
                'display' => 'vertical',
                'layout' => [
                    'billing_address_street',
                    'billing_address_state',
                    'billing_address_city'
                ],
                'groupFields' => [
                    'billing_address_street' => [
                        'name' => 'billing_address_street',
                        'vname' => 'LBL_BILLING_ADDRESS_STREET',
                        'type' => 'varchar',
                        'len' => '150',
                        'comment' => 'The street address used for billing address',
                        'group' => 'billing_address',
                        'merge_filter' => 'enabled',
                    ],
                    'billing_address_city' => [
                        'name' => 'billing_address_city',
                        'vname' => 'LBL_BILLING_ADDRESS_CITY',
                        'type' => 'varchar',
                        'len' => '100',
                        'comment' => 'The city used for billing address',
                        'group' => 'billing_address',
                        'merge_filter' => 'enabled',
                    ],
                    'billing_address_state' => [
                        'name' => 'billing_address_state',
                        'vname' => 'LBL_BILLING_ADDRESS_STATE',
                        'type' => 'varchar',
                        'len' => '100',
                        'group' => 'billing_address',
                        'comment' => 'The state used for billing address',
                        'merge_filter' => 'enabled',
                    ],
                ]
            ]
        ], $definition->getVardef());
    }

    /**
     * Test Group definition mapping
     */
    public function testDefaultLayout(): void
    {
        $definition = new FieldDefinition();
        $definition->setVardef([
            'industry' => [
                'name' => 'industry',
                'vname' => 'LBL_INDUSTRY',
                'type' => 'enum',
                'options' => 'industry_dom',
                'len' => 50,
                'comment' => 'The company belongs in this industry',
                'merge_filter' => 'enabled',
            ],
            'billing_address' => [
                'name' => 'billing_address',
                'vname' => 'LBL_BILLING_ADDRESS',
                'type' => 'grouped-field',
                'groupFields' => [
                    'billing_address_street',
                    'billing_address_city',
                    'billing_address_state'
                ],
                'display' => 'inline',
            ],
            'billing_address_street' => [
                'name' => 'billing_address_street',
                'vname' => 'LBL_BILLING_ADDRESS_STREET',
                'type' => 'varchar',
                'len' => '150',
                'comment' => 'The street address used for billing address',
                'group' => 'billing_address',
                'merge_filter' => 'enabled',
            ],
            'billing_address_city' => [
                'name' => 'billing_address_city',
                'vname' => 'LBL_BILLING_ADDRESS_CITY',
                'type' => 'varchar',
                'len' => '100',
                'comment' => 'The city used for billing address',
                'group' => 'billing_address',
                'merge_filter' => 'enabled',
            ],
            'billing_address_state' => [
                'name' => 'billing_address_state',
                'vname' => 'LBL_BILLING_ADDRESS_STATE',
                'type' => 'varchar',
                'len' => '100',
                'group' => 'billing_address',
                'comment' => 'The state used for billing address',
                'merge_filter' => 'enabled',
            ],
        ]);

        $this->handler->map($definition);

        static::assertEquals([
            'industry' => [
                'name' => 'industry',
                'vname' => 'LBL_INDUSTRY',
                'type' => 'enum',
                'options' => 'industry_dom',
                'len' => 50,
                'comment' => 'The company belongs in this industry',
                'merge_filter' => 'enabled',
            ],
            'billing_address_street' => [
                'name' => 'billing_address_street',
                'vname' => 'LBL_BILLING_ADDRESS_STREET',
                'type' => 'varchar',
                'len' => '150',
                'comment' => 'The street address used for billing address',
                'group' => 'billing_address',
                'merge_filter' => 'enabled',
            ],
            'billing_address_city' => [
                'name' => 'billing_address_city',
                'vname' => 'LBL_BILLING_ADDRESS_CITY',
                'type' => 'varchar',
                'len' => '100',
                'comment' => 'The city used for billing address',
                'group' => 'billing_address',
                'merge_filter' => 'enabled',
            ],
            'billing_address_state' => [
                'name' => 'billing_address_state',
                'vname' => 'LBL_BILLING_ADDRESS_STATE',
                'type' => 'varchar',
                'len' => '100',
                'group' => 'billing_address',
                'comment' => 'The state used for billing address',
                'merge_filter' => 'enabled',
            ],
            'billing_address' => [
                'name' => 'billing_address',
                'vname' => 'LBL_BILLING_ADDRESS',
                'type' => 'grouped-field',
                'display' => 'inline',
                'layout' => [
                    'billing_address_street',
                    'billing_address_city',
                    'billing_address_state'
                ],
                'groupFields' => [
                    'billing_address_street' => [
                        'name' => 'billing_address_street',
                        'vname' => 'LBL_BILLING_ADDRESS_STREET',
                        'type' => 'varchar',
                        'len' => '150',
                        'comment' => 'The street address used for billing address',
                        'group' => 'billing_address',
                        'merge_filter' => 'enabled',
                    ],
                    'billing_address_city' => [
                        'name' => 'billing_address_city',
                        'vname' => 'LBL_BILLING_ADDRESS_CITY',
                        'type' => 'varchar',
                        'len' => '100',
                        'comment' => 'The city used for billing address',
                        'group' => 'billing_address',
                        'merge_filter' => 'enabled',
                    ],
                    'billing_address_state' => [
                        'name' => 'billing_address_state',
                        'vname' => 'LBL_BILLING_ADDRESS_STATE',
                        'type' => 'varchar',
                        'len' => '100',
                        'group' => 'billing_address',
                        'comment' => 'The state used for billing address',
                        'merge_filter' => 'enabled',
                    ],
                ]
            ]
        ], $definition->getVardef());
    }

    /**
     * @throws Exception
     */
    public function _before(): void
    {
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

        $this->handler = new GroupedFieldDefinitionMapper($groupedFieldTypesMap);
    }
}
