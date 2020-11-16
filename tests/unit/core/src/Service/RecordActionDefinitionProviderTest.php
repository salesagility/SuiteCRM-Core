<?php

namespace App\Tests\unit\core\src\Service;

use App\Legacy\AclHandler;
use App\Service\AclManagerInterface;
use App\Service\RecordActionDefinitionProvider;
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
