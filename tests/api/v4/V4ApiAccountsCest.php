<?php namespace App\Tests;

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
