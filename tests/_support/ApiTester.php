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

use Codeception\Actor;
use Exception;

/**
 * Inherited Methods
 * @method void wantToTest($text)
 * @method void wantTo($text)
 * @method void execute($callable)
 * @method void expectTo($prediction)
 * @method void expect($prediction)
 * @method void amGoingTo($argumentation)
 * @method void am($role)
 * @method void lookForwardTo($achieveValue)
 * @method void comment($description)
 * @method void pause()
 *
 * @SuppressWarnings(PHPMD)
 */
class ApiTester extends Actor
{
    use _generated\ApiTesterActions;

    /**
     * Define custom actions here
     */

    /**
     * Login on V8 API
     * @param string $clientId
     * @param string $clientSecret
     * @return mixed
     * @throws Exception
     */
    public function v8Login(string $clientId, string $clientSecret): string
    {
        $this->sendPOST($this->getV8Path('/access_token'), [
            'grant_type' => 'client_credentials',
            'scope' => '',
            'client_id' => $clientId,
            'client_secret' => $clientSecret
        ]);

        $token = $this->grabDataFromResponseByJsonPath('$.access_token');

        return $token[0];
    }

    /**
     * Login on v4 API
     * @param string $user
     * @param string $password
     * @return mixed
     * @throws Exception
     */
    public function v4Login(string $user, string $password): string
    {
        $userAuth = [
            'user_name' => $user,
            'password' => md5($password),
        ];
        $appName = 'test';
        $nameValueList = [];

        $args = [
            'user_auth' => $userAuth,
            'application_name' => $appName,
            'name_value_list' => $nameValueList
        ];

        $result = $this->v4Request('login', $args);

        return $result['id'];
    }

    /**
     * Do v4 rest api request
     * @param string $method
     * @param array $arguments
     * @return mixed
     */
    public function v4Request(string $method, array $arguments)
    {
        $postData = array(
            'method' => $method,
            'input_type' => 'JSON',
            'response_type' => 'JSON',
            'rest_data' => json_encode($arguments),
        );

        $this->sendPOST($this->getV4Path(), $postData);

        $response = $this->grabResponse();

        return json_decode($response, true);
    }

    /**
     * Get v4 path
     * @return string
     */
    public function getV4Path(): string
    {
        return '/service/v4_1/rest.php';
    }

    /**
     * Get v8 path
     * @param string $path
     * @return string
     */
    public function getV8Path(string $path): string
    {
        return "/Api$path";
    }

    /**
     * Get uuid type check string
     * @return string
     */
    public function getUuidJsonType(): string
    {
        $uuidRegex = '[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}';

        return "string:regex(~$uuidRegex~)";
    }
}
