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
 namespace App\Tests;

use Codeception\Util\HttpCode;
use Exception;

class V8ApiAccountsCest
{
    /**
     * @var string
     */
    protected $token;

    /**
     * @param ApiTester $I
     * @throws Exception
     */
    public function _before(ApiTester $I): void
    {
        $this->token = $I->v8Login($I->getConfig('client_id'), $I->getConfig('client_secret'));
    }

    /**
     * Test account record creation
     * @param ApiTester $I
     */
    public function create(ApiTester $I): void
    {

        $I->amBearerAuthenticated($this->token);
        $I->sendPOST($I->getV8Path('/V8/module'), [
            'data' => [
                'type' => 'Accounts',
                'attributes' => [
                    'name' => 'V8 Api test Account'
                ]
            ]
        ]);
        $I->seeResponseCodeIs(HttpCode::CREATED); // 200
        $I->seeResponseIsJson();

        $uuidTypeCheck = $I->getUuidJsonType();

        $I->seeResponseContainsJson([
            'type' => 'Account',
        ]);

        $I->seeResponseMatchesJsonType([
            'data' => [
                'id' => $uuidTypeCheck,
            ]
        ]);

        $I->seeResponseContainsJson([
            'name' => 'V8 Api test Account'
        ]);
    }
}
