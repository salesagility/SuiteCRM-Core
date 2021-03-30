<?php

namespace SuiteCRM\Core\Modules\Users\Storage;

use SuiteCRM\Core\Modules\Users\Entity\OAuthRefreshToken;

use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\ORM\EntityRepository;
use OAuth2\Storage\RefreshTokenInterface;

class OAuthRefreshTokenStorage extends EntityRepository implements RefreshTokenInterface
{
    /**
     * @param $refreshToken
     * @return object|null
     */
    public function getRefreshToken($refreshToken)
    {
        $refreshToken = $this->findOneBy(['refresh_token' => $refreshToken]);

        if ($refreshToken) {
            $refreshToken = $refreshToken->toArray();
            $refreshToken['expires'] = $refreshToken['expires']->getTimestamp();
        }

        return $refreshToken;
    }

    /**
     * @param $refreshToken
     * @param $clientIdentifier
     * @param $user_id
     * @param $expires
     * @param null $scope
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function setRefreshToken($refreshToken, $clientIdentifier, $user_id, $expires, $scope = null)
    {
        $client = $this->_em->getRepository('SuiteCRM\Core\Modules\Users\Entity\OAuthClient')
            ->findOneBy(['client_identifier' => $clientIdentifier]);

        $client_id = $client->getId();

        $user = $this->_em->getRepository('SuiteCRM\Core\Modules\Users\Entity\OAuthUser')
            ->findOneBy(['id' => $user_id]);

        $refreshToken = OAuthRefreshToken::fromArray(
            [
                'refresh_token' => $refreshToken,
                'client' => $client,
                'user' => $user,
                'expires' => (new \DateTime())->setTimestamp($expires),
                'scope' => $scope,
                'client_id' => $client_id,
                'user_id' => $user_id,
            ]
        );

        $this->_em->persist($refreshToken);
        $this->_em->flush();
    }

    /**
     * @param $refreshToken
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function unsetRefreshToken($refreshToken)
    {
        $refreshToken = $this->findOneBy(['refresh_token' => $refreshToken]);
        $this->_em->remove($refreshToken);
        $this->_em->flush();
    }

    /**
     * Delete a row
     *
     * @param string $token
     * @return bool
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function expireToken($token): bool
    {
        $token = $this->findOneBy(['refresh_token' => $token]);

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
