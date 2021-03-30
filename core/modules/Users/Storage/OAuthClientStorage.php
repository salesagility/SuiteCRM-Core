<?php

namespace SuiteCRM\Core\Modules\Users\Storage;

use Doctrine\ORM\EntityRepository;
use OAuth2\Storage\ClientCredentialsInterface;
use SuiteCRM\Core\Modules\Users\Entity\OAuthClient;

class OAuthClientStorage extends EntityRepository implements ClientCredentialsInterface
{
    /**
     * Save function
     *
     * @param  $client
     * @return void
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function save($client)
    {
        $clientEntity = $this->getEntity($client);

        if (empty($clientEntity->getId())) {
            $this->_em->persist($clientEntity);
        } else {
            $this->_em->merge($clientEntity);
        }

        $this->_em->flush();
    }

    /**
     * @param $clientIdentifier
     * @return array|object|null
     */
    public function getClientDetails($clientIdentifier)
    {
        $client = $this->findOneBy(['client_identifier' => $clientIdentifier]);
        if ($client) {
            $client = $client->toArray();
        }

        return $client;
    }

    /**
     * @param $clientIdentifier
     * @param null $clientSecret
     * @return bool
     */
    public function checkClientCredentials($clientIdentifier, $clientSecret = null)
    {
        $client = $this->findOneBy(['client_identifier' => $clientIdentifier]);
        if ($client) {
            return $client->verifyClientSecret($clientSecret);
        }

        return false;
    }

    /**
     * @param $clientId
     * @param $grantType
     * @return bool
     */
    public function checkRestrictedGrantType($clientId, $grantType)
    {
        // we do not support different grant types per client in this example
        return true;
    }

    /**
     * @param $clientId
     * @return bool
     */
    public function isPublicClient($clientId)
    {
        return false;
    }

    /**
     * @param $clientId
     * @return null |null
     */
    public function getClientScope($clientId)
    {
        return null;
    }

    /**
     * Get Contact Entity
     *
     * @param array $entityData
     * @return \Mvc\Entity\Contact
     * @throws \Exception
     */
    public function getEntity($entityData = []): \Mvc\Entity\Contact
    {
        return new OAuthClient($entityData);
    }

}
