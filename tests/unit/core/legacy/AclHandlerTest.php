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


namespace App\Tests\unit\core\legacy;

use ACLController;
use App\Tests\UnitTester;
use AspectMock\Test;
use Codeception\Test\Unit;
use Exception;
use App\Engine\LegacyHandler\AclHandler;
use App\Module\LegacyHandler\ModuleNameMapperHandler;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

/**
 * Class AclHandlerTest
 * @package App\Tests\unit\core\legacy
 */
class AclHandlerTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var AclHandler
     */
    protected $handler;

    /**
     * @throws Exception
     * @noinspection StaticClosureCanBeUsedInspection
     */
    protected function _before(): void
    {

        test::double(ACLController::class, [
            'checkAccess' => static function (
                /** @noinspection PhpUnusedParameterInspection */
                $category,
                $action,
                $is_owner = false,
                $type = 'module',
                $in_group = false
            ) {
                $map = [
                    'Accounts' => [
                        'edit' => true
                    ],
                    'Contacts' => [
                        'false' => true
                    ],
                ];

                return $map[$category][$action] ?? false;
            },
        ]);


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

        test::double(AclHandler::class, [
            'startLegacyApp' => function (): void {
            },
        ]);

        $this->handler = new AclHandler(
            $this->tester->getProjectDir(),
            $this->tester->getLegacyDir(),
            $this->tester->getLegacySessionName(),
            $this->tester->getDefaultSessionName(),
            $this->tester->getLegacyScope(),
            $moduleNameMapper,
            $session
        );

    }

    /**
     * Test Authorized Action check
     */
    public function testAuthorizedAction(): void
    {
        $hasAccess = $this->handler->checkAccess('accounts', 'edit');
        static::assertTrue($hasAccess);
    }

    /**
     * Test UnAuthorized Action check
     */
    public function testUnAuthorizedAction(): void
    {
        $hasAccess = $this->handler->checkAccess('contacts', 'edit');
        static::assertTrue($hasAccess);
    }
}
