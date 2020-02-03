<?php

namespace App\Tests;

use App\Tests\FunctionalTester;

class LoginCest
{
    public function tryLogin(FunctionalTester $I)
    {
        $I->amOnPage('/#/Login');
        $I->fillField('username', 'admin');
        $I->fillField('password', 'admin');
        $I->click('Login');
    }
}

