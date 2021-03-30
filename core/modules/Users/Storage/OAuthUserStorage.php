<?php

namespace SuiteCRM\Core\Modules\Users\Storage;

use Doctrine\ORM\EntityRepository;
use OAuth2\Storage\UserCredentialsInterface;

class OAuthUserStorage extends EntityRepository implements UserCredentialsInterface
{
    /**
     * @param $username
     * @param $password
     * @return bool
     */
    public function checkUserCredentials($username, $password)
    {
//        $user = $this->findOneBy(['user_name' => $username]);
//
//        if ($user) {
//            return $user->verifyPassword($password);
//        }
//
//        return false;

        return true;
    }

    /**
     * @param $username
     * @return object|null ARRAY the associated "user_id" and optional "scope" values
     * ARRAY the associated "user_id" and optional "scope" values
     * This function MUST return FALSE if the requested user does not exist or is
     * invalid. "scope" is a space-separated list of restricted scopes.
     * @code
     * return array(
     *     "user_id"  => USER_ID,    // REQUIRED user_id to be stored with the authorization code or access token
     *     "scope"    => SCOPE       // OPTIONAL space-separated list of restricted scopes
     * );
     * @endcode
     */
    public function getUserDetails($username)
    {
        $user = $this->findOneBy(['username' => $username]);

        if ($user) {
            $user = $user->toArray();
        }

        return $user;
    }

//    public function setSessionId($accesstoken, $session_id)
//    {
//        $tokenEntity = $this->_em->getRepository('SuiteCRM\Core\Modules\Users\Entity\oAuthAccessToken')
//                            ->findOneBy(['token' => $accesstoken]);
//
//        $userId = $tokenEntity->getUserId();
//
//        $userEntity = $this->_em->getRepository('SuiteCRM\Core\Modules\Users\Entity\oAuthUser')
//                            ->findOneBy(['id' => $userId]);
//
//        $userEntity->setSessionId($session_id);
//
//        $this->_em->merge($userEntity);
//
//        $this->_em->flush();
//    }
}
