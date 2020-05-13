<?php

namespace App\Tests;

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
     */
    public function testNewApiRequestNotRedirected(AcceptanceTester $I): void
    {
        $I->amOnPage('/login');
        $I->canSeeInCurrentUrl('/login');
        $I->dontSeeInCurrentUrl('/legacy');
    }
}
