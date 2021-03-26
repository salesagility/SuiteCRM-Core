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

use App\Module\LegacyHandler\ModuleNameMapperHandler;
use App\Module\Service\ModuleNameMapperInterface;
use App\Tests\UnitTester;
use Codeception\Test\Unit;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;

/**
 * Class ModuleNameMapperTest
 * @package App\Tests
 */
class ModuleNameMapperTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleMapper;

    protected function _before(): void
    {
        $session = new Session(new MockArraySessionStorage('PHPSESSID'));
        $session->start();

        $this->moduleMapper = new ModuleNameMapperHandler(
            $this->tester->getProjectDir(),
            $this->tester->getLegacyDir(),
            $this->tester->getLegacySessionName(),
            $this->tester->getDefaultSessionName(),
            $this->tester->getLegacyScope(),
            $session
        );
    }

    /**
     * Test valid module name check with valid name
     */
    public function testValidLegacyModuleNameCheck(): void
    {
        $valid = $this->moduleMapper->isValidModule('Contacts');

        static::assertTrue($valid);
    }

    /**
     * Test valid module name check with invalid name
     */
    public function testInvalidLegacyModuleNameCheck(): void
    {
        $valid = $this->moduleMapper->isValidModule('FakeModule');

        static::assertFalse($valid);
    }

    /**
     * Test module name conversion to frontend with valid name
     */
    public function testLegacyModuleNameToFrontEndConversion(): void
    {
        $frontendName = $this->moduleMapper->toFrontEnd('Contacts');
        static::assertEquals('contacts', $frontendName);
    }

    /**
     * Test module name conversion to frontend with invalid name
     */
    public function testInvalidLegacyModuleNameToFrontEndConversion(): void
    {
        $frontend = $this->moduleMapper->toFrontEnd('FakeModule');
        static::assertEquals('FakeModule', $frontend);
    }

    /**
     * Test module name conversion to core with valid name
     */
    public function testLegacyModuleNameToCoreConversion(): void
    {
        $coreName = $this->moduleMapper->toCore('Contacts');
        static::assertEquals('Contacts', $coreName);
    }

    /**
     * Test module name conversion to core with invalid name
     */
    public function testInvalidLegacyModuleNameToCoreConversion(): void
    {
        $core = $this->moduleMapper->toCore('FakeModule');
        static::assertEquals('FakeModule', $core);
    }

}
