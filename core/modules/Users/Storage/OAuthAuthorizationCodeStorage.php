<?php

namespace SuiteCRM\Core\Modules\Users\Storage;

use SuiteCRM\Core\Modules\Users\Entity\OAuthAuthorizationCode;

use Doctrine\ORM\EntityRepository;

use OAuth2\OpenID\Storage\AuthorizationCodeInterface;

class OAuthAuthorizationCodeStorage extends EntityRepository implements AuthorizationCodeInterface
{
    /**
     * @param $code
     * @return object|null
     */
    public function getAuthorizationCode($code)
    {
        $authCode = $this->findOneBy(['code' => $code]);

        if ($authCode) {
            $authCode = $authCode->toArray();
            $authCode['expires'] = $authCode['expires']->getTimestamp();
        }

        return $authCode;
    }

    /**
     * @param string $code
     * @param mixed $client_id
     * @param mixed $user_id
     * @param string $redirect_uri
     * @param int $expires
     * @param null $scope
     * @param null $id_token
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function setAuthorizationCode(
        $code,
        $client_id,
        $user_id,
        $redirect_uri,
        $expires,
        $scope = null,
        $id_token = null
    ) {
        $client = $this->_em->getRepository('SuiteCRM\Core\Modules\Users\Entity\OAuthClient')
            ->findOneBy(['client_identifier' => $client_id]);

        $user = $this->_em->getRepository('SuiteCRM\Core\Modules\Users\Entity\OAuthUser')
            ->findOneBy(['user_name' => $user_id]);

        $authCode = OAuthAuthorizationCode::fromArray(
            [
                'code' => $code,
                'client' => $client,
                'user' => $user,
                'redirect_uri' => $redirect_uri,
                'expires' => (new \DateTime())->setTimestamp($expires),
                'scope' => $scope,
                'id_token' => $id_token
            ]
        );

        $this->_em->persist($authCode);
        $this->_em->flush();
    }

    /**
     * @param $code
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function expireAuthorizationCode($code)
    {
        $authCode = $this->findOneBy(['code' => $code]);
        $this->_em->remove($authCode);
        $this->_em->flush();
    }
}
