<?php
namespace App\Tests;

use Codeception\Actor;
use Codeception\Lib\Friend;

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
 * @method Friend haveFriend($name, $actorClass = NULL)
 *
 * @SuppressWarnings(PHPMD)
*/
class AcceptanceTester extends Actor
{
    use _generated\AcceptanceTesterActions;

   /**
    * Define custom actions here
    */

    /**
     * @param string $name
     * @param string $password
     */
    public function login(string $name, string $password): void
    {
        /**
         * To implement when auth is working
         */
    }

    /**
     * Login using legacy app
     * @param string $name
     * @param string $password
     */
    public function loginInLegacy(string $name, string $password): void
    {
        $this->amOnPage('/legacy/index.php?action=Login&module=Users');
        $this->fillField('user_name', $name);
        $this->fillField('username_password', $password);
        $this->click('Log In');
        $this->seeInCurrentUrl('index.php?module=Home&action=index');
    }
}
