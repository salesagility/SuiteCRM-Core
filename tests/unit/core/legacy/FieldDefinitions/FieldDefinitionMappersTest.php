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

use App\FieldDefinitions\LegacyHandler\FieldDefinitionMapperInterface;
use App\FieldDefinitions\LegacyHandler\FieldDefinitionMappers;
use App\FieldDefinitions\LegacyHandler\GroupedFieldDefinitionMapper;
use App\FieldDefinitions\LegacyHandler\LegacyGroupedFieldDefinitionMapper;
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
