<?php namespace App\Tests;

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
