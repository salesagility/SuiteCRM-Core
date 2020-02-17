<?php

namespace App\Tests;

use App\Tests\FunctionalTester;

class LoginCest
{
    public function tryBypassCSRF(FunctionalTester $I): void
    {
        $I->amOnPage('login');
        $I->seeResponseCodeIs(403);
    }
}

