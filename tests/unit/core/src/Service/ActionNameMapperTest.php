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

use App\Process\Service\ActionNameMapperInterface;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use App\Engine\LegacyHandler\ActionNameMapperHandler;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

/**
 * Class ActionNameMapperTest
 * @package App\Tests\unit\core\src\Service
 */
class ActionNameMapperTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var ActionNameMapperInterface
     */
    private $actionMapper;

    protected function _before(): void
    {
        $session = new Session(new MockArraySessionStorage('PHPSESSID'));
        $session->start();

        $this->actionMapper = new ActionNameMapperHandler(
            $this->tester->getProjectDir(),
            $this->tester->getLegacyDir(),
            $this->tester->getLegacySessionName(),
            $this->tester->getDefaultSessionName(),
            $this->tester->getLegacyScope(),
            $session
        );
    }

    /**
     * Test action name check with the valid name
     */
    public function testValidLegacyActionNameCheck(): void
    {
        $valid = $this->actionMapper->isValidAction('DetailView');

        static::assertTrue($valid);
    }

    /**
     * Test action name check with the invalid name
     */
    public function testInvalidLegacyActionNameCheck(): void
    {
        $valid = $this->actionMapper->isValidAction('FakeAction');
        static::assertFalse($valid);
    }

    /**
     * Test action name to frontend mapping with the valid name
     */
    public function testLegacyActionNameToFrontEndConversion(): void
    {
        $frontendName = $this->actionMapper->toFrontEnd('DetailView');
        static::assertEquals('record', $frontendName);
    }

    /**
     * Test action name to frontend mapping with the invalid name
     */
    public function testInvalidLegacyActionNameToFrontEndConversion(): void
    {
        $action = $this->actionMapper->toFrontEnd('FakeAction');
        static::assertEquals('FakeAction', $action);
    }

    /**
     * Test action name to legacy mapping with the valid name
     */
    public function testLegacyActionNameToLegacyConversion(): void
    {
        $legacyName = $this->actionMapper->toLegacy('record');
        static::assertEquals('DetailView', $legacyName);
    }

    /**
     * Test action name to legacy mapping with the invalid name
     */
    public function testInvalidLegacyActionNameToLegacyConversion(): void
    {
        $action = $this->actionMapper->toLegacy('fake-action');
        static::assertEquals('fake-action', $action);
    }

}
