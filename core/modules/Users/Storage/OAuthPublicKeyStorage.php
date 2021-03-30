<?php

namespace SuiteCRM\Core\Modules\Users\Storage;

use Doctrine\ORM\EntityRepository;
use OAuth2\Storage\PublicKeyInterface;

class OAuthPublicKeyStorage extends EntityRepository implements PublicKeyInterface
{
    /**
     * @param mixed $client_id
     * @return mixed
     */
    public function getPublicKey($client_id = null)
    {
    }

    /**
     * @param mixed $client_id
     * @return mixed
     */
    public function getPrivateKey($client_id = null)
    {
    }

    /**
     * @param mixed $client_id
     * @return mixed
     */
    public function getEncryptionAlgorithm($client_id = null)
    {
    }
}
