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

class V4ApiAccountsCest
{
    /**
     * @var string
     */
    protected $session;

    /**
     * @param ApiTester $I
     * @throws Exception
     */
    public function _before(ApiTester $I): void
    {
        $this->session = $I->v4Login($I->getConfig('user_name'), $I->getConfig('password'));
    }

    /**
     * Test account record creation
     * @param ApiTester $I
     */
    public function create(ApiTester $I): void
    {

        $entryArgs = array(
            'session' => $this->session,
            'module_name' => 'Accounts',
            'name_value_list' => [
                'name' => 'V4 Api test Account'
            ],
            'track_view' => false
        );

        $I->v4Request('set_entry', $entryArgs);

        $I->seeResponseCodeIs(HttpCode::OK); // 200
        $I->seeResponseIsJson();

        $uuidTypeCheck = $I->getUuidJsonType();

        $I->seeResponseMatchesJsonType([
            'id' => $uuidTypeCheck,
        ]);

        $I->seeResponseContainsJson([
            'entry_list' => [
                'name' => [
                    'name' => 'name',
                    'value' => 'V4 Api test Account'
                ]
            ]
        ]);
    }
}
