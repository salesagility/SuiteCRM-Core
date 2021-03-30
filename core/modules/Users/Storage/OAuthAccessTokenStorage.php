<?php

namespace SuiteCRM\Core\Modules\Users\Storage;

use SuiteCRM\Core\Modules\Users\Entity\OAuthAccessToken;

use Doctrine\ORM\EntityRepository;
use OAuth2\Storage\AccessTokenInterface;

class OAuthAccessTokenStorage extends EntityRepository implements AccessTokenInterface
{
    /**
     * @param string $oauthToken
     * @return array|object|null
     */
    public function getAccessToken($oauthToken)
    {
        $token = $this->findOneBy(['token' => $oauthToken]);

        if ($token) {
            $token = $token->toArray();
            $token['expires'] = $token['expires']->getTimestamp();
        }

        return $token;
    }

    /**
     * @param string $oauthToken
     * @param mixed $clientIdentifier
     * @param mixed $user_id
     * @param int $expires
     * @param null $scope
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function setAccessToken($oauthToken, $clientIdentifier, $user_id, $expires, $scope = null)
    {
        $client = $this->_em->getRepository('SuiteCRM\Core\Modules\Users\Entity\OAuthClient')
            ->findOneBy(['client_identifier' => $clientIdentifier]);

        $user = $this->_em->getRepository('SuiteCRM\Core\Modules\Users\Entity\OAuthUser')
            ->findOneBy(['id' => $user_id]);

        $client_id = $client->getId();

        $token = OAuthAccessToken::fromArray(
            [
                'token' => $oauthToken,
                'client_id' => $client_id,
                'user_id' => $user_id,
                'expires' => (new \DateTime())->setTimestamp($expires),
                'scope' => $scope,
                'user' => $user,
                'client' => $client,
            ]
        );

        $this->_em->persist($token);
        $this->_em->flush();
    }

    /**
     * Delete a row
     *
     * @param string $token
     * @return bool
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function expireToken($token): bool
    {
        $token = $this->findOneBy(['token' => $token]);

        if (!empty($token)) {
            $ts = time();

            $datetime = new \DateTime();
            $datetime->setTimestamp($ts);

            $token->setExpires($datetime);

            $this->_em->merge($token);

            return $this->_em->flush();
        }

        throw new \RuntimeException('No Token Found.');
    }

}
