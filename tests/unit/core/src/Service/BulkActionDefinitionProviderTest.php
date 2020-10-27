<?php

namespace App\Tests;

use App\Service\AclManagerInterface;
use App\Service\BulkActionDefinitionProvider;
use Codeception\Test\Unit;
use Exception;
use App\Legacy\AclHandler;

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
