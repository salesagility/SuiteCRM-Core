<?php
/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see http://www.gnu.org/licenses.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */


namespace App\Tests\unit\core\legacy\FieldDefinitions;

use App\FieldDefinitions\Entity\FieldDefinition;
use App\FieldDefinitions\LegacyHandler\LegacyGroupedFieldDefinitionMapper;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use Exception;

/**
 * Class LegacyGroupedFieldsMapperTest
 * @package App\Tests\unit\core\legacy\FieldDefinitions
 */
class LegacyGroupedFieldDefinitionMapperTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var LegacyGroupedFieldDefinitionMapper
     */
    protected $handler;

    /**
     * Test Get Key
     */
    public function testGetKey(): void
    {
        static::assertEquals('legacy-grouped-fields', $this->handler->getKey());
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
                'type' => 'grouped-field',
                'legacyGroup' => true,
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
     * Test different fieldGroup definition mapping
     */
    public function testDifferentFieldGroupDefinitionMapping(): void
    {
        $definition = new FieldDefinition();
        $definition->setVardef([
            'last_name' => [
                'name' => 'last_name',
                'vname' => 'LBL_LAST_NAME',
                'type' => 'varchar',
                'len' => '100',
                'unified_search' => true,
                'full_text_search' => ['boost' => 3],
                'comment' => 'Last name of the contact',
                'merge_filter' => 'selected',
                'required' => true,
                'importable' => 'required',
            ],
            'name' => [
                'name' => 'name',
                'rname' => 'name',
                'vname' => 'LBL_NAME',
                'type' => 'name',
                'link' => true,
                'fields' => ['first_name', 'last_name'],
                'sort_on' => 'last_name',
                'source' => 'non-db',
                'group' => 'last_name',
                'len' => '255',
                'db_concat_fields' => [0 => 'first_name', 1 => 'last_name'],
                'importable' => 'false',
            ],
            'full_name' => [
                'name' => 'full_name',
                'rname' => 'full_name',
                'vname' => 'LBL_NAME',
                'type' => 'fullname',
                'fields' => ['first_name', 'last_name'],
                'sort_on' => 'last_name',
                'source' => 'non-db',
                'group' => 'last_name',
                'len' => '510',
                'db_concat_fields' => [0 => 'first_name', 1 => 'last_name'],
                'studio' => ['listview' => false],
            ],
        ]);

        $this->handler->map($definition);

        static::assertEquals([
            'last_name' => [
                'name' => 'last_name',
                'vname' => 'LBL_LAST_NAME',
                'type' => 'varchar',
                'len' => '100',
                'unified_search' => true,
                'full_text_search' => ['boost' => 3],
                'comment' => 'Last name of the contact',
                'merge_filter' => 'selected',
                'required' => true,
                'importable' => 'required',
                'legacyGroup' => true,
                'groupFields' => [
                    'name' => [
                        'name' => 'name',
                        'rname' => 'name',
                        'vname' => 'LBL_NAME',
                        'type' => 'name',
                        'link' => true,
                        'fields' => ['first_name', 'last_name'],
                        'sort_on' => 'last_name',
                        'source' => 'non-db',
                        'group' => 'last_name',
                        'len' => '255',
                        'db_concat_fields' => [0 => 'first_name', 1 => 'last_name'],
                        'importable' => 'false',
                    ],
                    'full_name' => [
                        'name' => 'full_name',
                        'rname' => 'full_name',
                        'vname' => 'LBL_NAME',
                        'type' => 'fullname',
                        'fields' => ['first_name', 'last_name'],
                        'sort_on' => 'last_name',
                        'source' => 'non-db',
                        'group' => 'last_name',
                        'len' => '510',
                        'db_concat_fields' => [0 => 'first_name', 1 => 'last_name'],
                        'studio' => ['listview' => false],
                    ],
                ]
            ],
            'name' => [
                'name' => 'name',
                'rname' => 'name',
                'vname' => 'LBL_NAME',
                'type' => 'name',
                'link' => true,
                'fields' => ['first_name', 'last_name'],
                'sort_on' => 'last_name',
                'source' => 'non-db',
                'group' => 'last_name',
                'len' => '255',
                'db_concat_fields' => [0 => 'first_name', 1 => 'last_name'],
                'importable' => 'false',
            ],
            'full_name' => [
                'name' => 'full_name',
                'rname' => 'full_name',
                'vname' => 'LBL_NAME',
                'type' => 'fullname',
                'fields' => ['first_name', 'last_name'],
                'sort_on' => 'last_name',
                'source' => 'non-db',
                'group' => 'last_name',
                'len' => '510',
                'db_concat_fields' => [0 => 'first_name', 1 => 'last_name'],
                'studio' => ['listview' => false],
            ],
        ], $definition->getVardef());
    }

    /**
     * Test different fieldGroup definition mapping
     */
    public function testSameFieldGroupDefinitionMapping(): void
    {
        $definition = new FieldDefinition();
        $definition->setVardef([
            'email1' => [
                'name' => 'email1',
                'vname' => 'LBL_EMAIL_ADDRESS',
                'type' => 'varchar',
                'function' => [
                    'name' => 'getEmailAddressWidget',
                    'returns' => 'html'
                ],
                'source' => 'non-db',
                'group' => 'email1',
                'merge_filter' => 'enabled',
                'studio' => ['editview' => true, 'editField' => true, 'searchview' => false, 'popupsearch' => false],
                'full_text_search' => ['boost' => 3, 'analyzer' => 'whitespace'],
            ],
        ]);

        $this->handler->map($definition);

        static::assertEquals([
            'email1' => [
                'name' => 'email1',
                'vname' => 'LBL_EMAIL_ADDRESS',
                'type' => 'varchar',
                'function' => [
                    'name' => 'getEmailAddressWidget',
                    'returns' => 'html'
                ],
                'source' => 'non-db',
                'group' => 'email1',
                'merge_filter' => 'enabled',
                'studio' => ['editview' => true, 'editField' => true, 'searchview' => false, 'popupsearch' => false],
                'full_text_search' => ['boost' => 3, 'analyzer' => 'whitespace'],
            ],
        ], $definition->getVardef());
    }

    /**
     * @throws Exception
     */
    protected function _before(): void
    {
        $this->handler = new LegacyGroupedFieldDefinitionMapper();
    }
}
