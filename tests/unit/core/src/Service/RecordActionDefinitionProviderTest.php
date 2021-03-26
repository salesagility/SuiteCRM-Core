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


namespace App\Tests\unit\core\src\Service;

use App\Engine\LegacyHandler\AclHandler;
use App\Engine\Service\AclManagerInterface;
use App\Data\Service\RecordActionDefinitionProvider;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use Exception;

/**
 * Class RecordActionDefinitionProviderTest
 * @package App\Tests
 */
class RecordActionDefinitionProviderTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var RecordActionDefinitionProvider
     */
    protected $service;

    /**
     * @throws Exception
     */
    protected function _before(): void
    {

        $recordViewActions = [
            'default' => [
                'actions' => [
                    'create' => [
                        'key' => 'create',
                        'labelKey' => 'LBL_NEW',
                        'acl' => ['edit'],
                        'mode' => ['detail']
                    ],
                    'edit' => [
                        'key' => 'edit',
                        'labelKey' => 'LBL_EDIT',
                        'acl' => ['edit'],
                        'mode' => ['detail']
                    ],
                    'delete' => [
                        'key' => 'delete',
                        'labelKey' => 'LBL_DELETE',
                        'asyncProcess' => true,
                        'acl' => ['delete'],
                        'mode' => ['detail']
                    ],
                ]
            ],
            'modules' => [
                'accounts' => [
                    'exclude' => ['edit'],
                    'actions' => [
                        'pdf' => [
                            'key' => 'pdf',
                            'params' => [
                                'min' => 1,
                                'max' => 5
                            ]
                        ]
                    ]

                ]
            ]
        ];


        /** @var AclManagerInterface $aclManager */
        $aclManager = $this->make(
            AclHandler::class,
            [
                'checkAccess' => static function (
                    /** @noinspection PhpUnusedParameterInspection */
                    string $module,
                    string $action,
                    bool $isOwner = false
                ): bool {
                    return true;
                }
            ]
        );


        $this->service = new RecordActionDefinitionProvider(
            $recordViewActions,
            $aclManager
        );
    }

    /**
     * Ensure the format of the returned items is the expected
     */
    public function testDefaultActionsRetrieval(): void
    {
        $actions = $this->service->getActions('contacts');
        static::assertNotNull($actions);
        static::assertNotEmpty($actions);
        static::assertArrayHasKey('delete', $actions);
        static::assertSame([
            'key' => 'delete',
            'labelKey' => 'LBL_DELETE',
            'asyncProcess' => true,
            'acl' => ['delete'],
            'mode' => ['detail']
        ], $actions['delete']);


        static::assertArrayHasKey('edit', $actions);
        static::assertSame([
            'key' => 'edit',
            'labelKey' => 'LBL_EDIT',
            'acl' => ['edit'],
            'mode' => ['detail']
        ], $actions['edit']);

        static::assertArrayHasKey('create', $actions);
        static::assertSame([
            'key' => 'create',
            'labelKey' => 'LBL_NEW',
            'acl' => ['edit'],
            'mode' => ['detail']
        ], $actions['create']);
    }

    /**
     * Ensure the format of the returned items is the expected
     */
    public function testModuleActionsOverride(): void
    {
        $actions = $this->service->getActions('accounts');
        static::assertNotNull($actions);
        static::assertNotEmpty($actions);
        static::assertArrayHasKey('delete', $actions);
        static::assertSame([
            'key' => 'delete',
            'labelKey' => 'LBL_DELETE',
            'asyncProcess' => true,
            'acl' => ['delete'],
            'mode' => ['detail']
        ], $actions['delete']);

        static::assertArrayNotHasKey('edit', $actions);

        static::assertArrayHasKey('create', $actions);
        static::assertSame([
            'key' => 'create',
            'labelKey' => 'LBL_NEW',
            'acl' => ['edit'],
            'mode' => ['detail']
        ], $actions['create']);

        static::assertArrayHasKey('pdf', $actions);
        static::assertSame([
            'key' => 'pdf',
            'params' => [
                'min' => 1,
                'max' => 5
            ],
        ], $actions['pdf']);
    }
}
