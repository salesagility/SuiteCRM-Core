<?php

namespace App\Tests;

use App\Tests\AcceptanceTester;

class LegacyRedirectCest
{
    public function _before(AcceptanceTester $I)
    {
    }

    public function testLegacyModuleIndexRoute(AcceptanceTester $I)
    {
        $I->login($I->getConfig('login_username'), $I->getConfig('login_password'));

        $module = 'Contacts';
        $resultingRoute = '/#/contacts';

        $I->amOnPage("index.php?module=$module");
        $I->canSeeInCurrentUrl($resultingRoute);
    }

    public function testLegacyModuleViewRoute(AcceptanceTester $I)
    {
        $I->login($I->getConfig('login_username'), $I->getConfig('login_password'));

        $module = 'Contacts';
        $action = 'ListView';
        $resultingRoute = '/#/contacts/list';

        $I->amOnPage("index.php?module=$module&action=$action");
        $I->canSeeInCurrentUrl($resultingRoute);
    }

    public function testLegacyModuleRecordRoute(AcceptanceTester $I)
    {
        $I->login($I->getConfig('login_username'), $I->getConfig('login_password'));

        $module = 'Contacts';
        $action = 'DetailView';
        $record = '123';
        $resultingRoute = '/#/contacts/detail/123';

        $I->amOnPage("index.php?module=$module&action=$action&record=$record");
        $I->canSeeInCurrentUrl($resultingRoute);
    }
}
