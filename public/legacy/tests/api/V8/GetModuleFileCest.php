<?php
namespace Test\Api\V8;

use ApiTester;

#[\AllowDynamicProperties]
class GetModuleFileCest
{
    /**
     * @param ApiTester $I
     *
     * @throws \Codeception\Exception\ModuleException
     */
    public function _before(ApiTester $I)
    {
        $I->login();
    }

    /**
     * @param ApiTester $I
     *
     * @throws \Exception
     */
    public function shouldReturnNoteAttachment(ApiTester $I)
    {
        $fileContents = 'SuiteCRM V8 API file download test';

        $I->sendPOST($I->getInstanceURL() . '/Api/V8/module', [
            'data' => [
                'type' => 'Notes',
                'attributes' => [
                    'name' => 'Note with attachment',
                    'filename' => 'test.txt',
                    'filecontents' => base64_encode($fileContents),
                ],
            ],
        ]);
        $I->seeResponseCodeIs(201);
        $I->seeResponseIsJson();
        $id = $I->grabDataFromResponseByJsonPath('$.data.id')[0];

        $I->sendGET($I->getInstanceURL() . '/Api/V8/module/Notes/' . $id . '/file');
        $I->seeResponseCodeIs(200);
        $I->seeResponseIsJson();
        $I->canSeeResponseContainsJson([
            'id' => $id,
        ]);

        $attributes = $I->grabDataFromResponseByJsonPath('$.data.attributes')[0];
        $I->assertEquals('test.txt', $attributes['filename']);
        $I->assertEquals($fileContents, base64_decode($attributes['filecontents']));

        @unlink('upload/' . $id);
        $I->deleteBean('notes', $id);
    }

    /**
     * @param ApiTester $I
     *
     * @throws \Exception
     */
    public function shouldNotWorkWithoutAttachedFile(ApiTester $I)
    {
        $I->sendPOST($I->getInstanceURL() . '/Api/V8/module', [
            'data' => [
                'type' => 'Notes',
                'attributes' => [
                    'name' => 'Note without attachment',
                ],
            ],
        ]);
        $I->seeResponseCodeIs(201);
        $id = $I->grabDataFromResponseByJsonPath('$.data.id')[0];

        $I->sendGET($I->getInstanceURL() . '/Api/V8/module/Notes/' . $id . '/file');
        $I->seeResponseCodeIs(400);
        $I->seeResponseIsJson();
        $I->canSeeResponseContainsJson([
            'errors' => [
                'status' => 400,
            ],
        ]);

        $I->deleteBean('notes', $id);
    }

    /**
     * @param ApiTester $I
     *
     * @throws \Exception
     */
    public function shouldNotWorkForUnsupportedModule(ApiTester $I)
    {
        $id = $I->createAccount();

        $I->sendGET($I->getInstanceURL() . '/Api/V8/module/Accounts/' . $id . '/file');
        $I->seeResponseCodeIs(400);
        $I->seeResponseIsJson();
        $I->canSeeResponseContainsJson([
            'errors' => [
                'status' => 400,
                'detail' => 'Module Accounts does not support file attachments',
            ],
        ]);

        $I->deleteBean('accounts', $id);
    }
}
