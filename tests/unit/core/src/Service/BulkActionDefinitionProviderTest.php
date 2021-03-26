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

use App\Engine\Service\AclManagerInterface;
use App\Process\Service\BulkActionDefinitionProvider;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use Exception;
use App\Engine\LegacyHandler\AclHandler;

/**
 * Class BulkActionDefinitionProviderTest
 * @package App\Tests
 */
class BulkActionDefinitionProviderTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var BulkActionDefinitionProvider
     */
    protected $service;

    /**
     * @throws Exception
     */
    protected function _before(): void
    {

        $listViewBulkActions = [
            'default' => [
                'actions' => [
                    'delete' => [
                        'key' => 'delete',
                        'labelKey' => 'LBL_DELETE',
                        'params' => [
                            'min' => 1,
                            'max' => 5
                        ],
                        'acl' => ['delete']
                    ],
                    'export' => [
                        'key' => 'export',
                        'labelKey' => 'LBL_EXPORT',
                        'params' => [
                            'min' => 1,
                            'max' => 5
                        ],
                        'acl' => ['export']
                    ],
                    'merge' => [
                        'key' => 'merge',
                        'labelKey' => 'LBL_MERGE_DUPLICATES',
                        'params' => [
                            'min' => 1,
                            'max' => 5
                        ],

                        'acl' => ['edit', 'delete']
                    ],
                    'massupdate' => [
                        'key' => 'massupdate',
                        'labelKey' => 'LBL_MASS_UPDATE',
                        'params' => [
                            'min' => 1,
                            'max' => 5
                        ],
                        'acl' => ['massupdate']
                    ]
                ]
            ],
            'modules' => [
                'accounts' => [
                    'exclude' => ['massupdate'],
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


        $this->service = new BulkActionDefinitionProvider(
            $listViewBulkActions,
            $aclManager
        );
    }

    /**
     * Ensure the format of the returned items is the expected
     */
    public function testDefaultActionsRetrieval(): void
    {
        $actions = $this->service->getBulkActions('contacts');
        static::assertNotNull($actions);
        static::assertNotEmpty($actions);
        static::assertArrayHasKey('delete', $actions);
        static::assertSame([
            'key' => 'delete',
            'labelKey' => 'LBL_DELETE',
            'params' => [
                'min' => 1,
                'max' => 5
            ],
            'acl' => ['delete']
        ], $actions['delete']);


        static::assertArrayHasKey('merge', $actions);
        static::assertSame([
            'key' => 'merge',
            'labelKey' => 'LBL_MERGE_DUPLICATES',
            'params' => [
                'min' => 1,
                'max' => 5
            ],
            'acl' => ['edit', 'delete']
        ], $actions['merge']);

        static::assertArrayHasKey('export', $actions);
        static::assertSame([
            'key' => 'export',
            'labelKey' => 'LBL_EXPORT',
            'params' => [
                'min' => 1,
                'max' => 5
            ],
            'acl' => ['export']
        ], $actions['export']);

        static::assertArrayHasKey('massupdate', $actions);
        static::assertSame([
            'key' => 'massupdate',
            'labelKey' => 'LBL_MASS_UPDATE',
            'params' => [
                'min' => 1,
                'max' => 5
            ],
            'acl' => ['massupdate']
        ], $actions['massupdate']);
    }

    /**
     * Ensure the format of the returned items is the expected
     */
    public function testModuleActionsOverride(): void
    {
        $actions = $this->service->getBulkActions('accounts');
        static::assertNotNull($actions);
        static::assertNotEmpty($actions);
        static::assertArrayHasKey('delete', $actions);
        static::assertSame([
            'key' => 'delete',
            'labelKey' => 'LBL_DELETE',
            'params' => [
                'min' => 1,
                'max' => 5
            ],
            'acl' => ['delete']
        ], $actions['delete']);


        static::assertArrayHasKey('merge', $actions);
        static::assertSame([
            'key' => 'merge',
            'labelKey' => 'LBL_MERGE_DUPLICATES',
            'params' => [
                'min' => 1,
                'max' => 5
            ],
            'acl' => ['edit', 'delete']
        ], $actions['merge']);

        static::assertArrayHasKey('export', $actions);
        static::assertSame([
            'key' => 'export',
            'labelKey' => 'LBL_EXPORT',
            'params' => [
                'min' => 1,
                'max' => 5
            ],
            'acl' => ['export']
        ], $actions['export']);

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
