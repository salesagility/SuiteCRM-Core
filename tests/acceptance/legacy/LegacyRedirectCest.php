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


namespace App\Tests\acceptance\legacy;

use App\Tests\AcceptanceTester;

/**
 * Class LegacyRedirectCest
 * @package App\Tests\acceptance\legacy
 */
class LegacyRedirectCest
{
    /**
     * @param AcceptanceTester $I
     */
    public function _before(AcceptanceTester $I): void
    {
    }

    /**
     * Test that legacy non-view action requests are redirected
     *
     * @param AcceptanceTester $I
     */
    public function testLegacyNonViewActionRequestRedirection(AcceptanceTester $I): void
    {
        $I->loginInLegacy($I->getConfig('login_username'), $I->getConfig('login_password'));
        $I->amOnPage('/index.php?entryPoint=generatePdf');
        $I->canSeeInCurrentUrl('/legacy/index.php?entryPoint=generatePdf');
    }

    /**
     * Test that legacy custom root php file requests are re-directed
     *
     * @param AcceptanceTester $I
     */
    public function testLegacyCustomRootPhpFileRequestRedirection(AcceptanceTester $I): void
    {
        $I->amOnPage('/some.php?hahah=123');
        $I->canSeeInCurrentUrl('/legacy/some.php?hahah=123');
    }

    /**
     * Test that legacy custom non-root php file request are redirected
     *
     * @param AcceptanceTester $I
     */
    public function testLegacyCustomNonRootPhpFileRequestRedirection(AcceptanceTester $I): void
    {
        $I->amOnPage('/something/some.php');
        $I->canSeeInCurrentUrl('/legacy/something/some.php');
    }

    /**
     * Test that legacy custom legacy path requests are re-directed
     *
     * @param AcceptanceTester $I
     */
    public function testLegacyCustomPathRequestRedirection(AcceptanceTester $I): void
    {
        $I->amOnPage('/something');
        $I->canSeeInCurrentUrl('/legacy/something');
    }

    /**
     * Test that New API Request are not re-directed
     *
     * @param AcceptanceTester $I
     * @skip Requires API assertions fix
     */
    public function testNewApiRequestNotRedirected(AcceptanceTester $I): void
    {
        $I->amOnPage('/login');
        $I->canSeeInCurrentUrl('/login');
        $I->dontSeeInCurrentUrl('/legacy');
    }
}
