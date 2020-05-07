<?php

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
