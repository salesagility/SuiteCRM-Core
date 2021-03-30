<?php

namespace SuiteCRM\Core\Modules\Users\Storage;

use Doctrine\ORM\EntityRepository;
use OAuth2\OpenID\Storage\UserClaimsInterface;

use SuiteCRM\Core\Modules\Users\Entity\OAuthUserClaims;

class OAuthUserClaimsStorage extends EntityRepository implements UserClaimsInterface
{
    /**
     * @param mixed $user_id
     * @param string $scope
     * @return array|bool
     */
    public function getUserClaims($user_id, $scope)
    {
        if (!$userDetails = $this->getUserDetails($user_id)) {
            return false;
        }

        $claims = explode(' ', trim($claims));

        $userClaims = [];
        // for each requested claim, if the user has the claim, set it in the response
        $validClaims = explode(' ', self::VALID_CLAIMS);

        foreach ($validClaims as $validClaim) {
            if (in_array($validClaim, $claims, true)) {
                if ($validClaim == 'address') {
                    // address is an object with subfields
                    $userClaims['address'] = $this->getUserClaim($validClaim, $userDetails['address'] ?: $userDetails);
                } else {
                    $userClaims = array_merge($userClaims, $this->getUserClaim($validClaim, $userDetails));
                }
            }
        }

        return $userClaims;
    }

    /**
     * @param $claim
     * @param $userDetails
     * @return array
     */
    protected function getUserClaim($claim, $userDetails)
    {
        $userClaims = [];
        $claimValuesString = constant(sprintf('self::%s_CLAIM_VALUES', strtoupper($claim)));
        $claimValues = explode(' ', $claimValuesString);
        foreach ($claimValues as $value) {
            $userClaims[$value] = isset($userDetails[$value]) ? $userDetails[$value] : null;
        }

        return $userClaims;
    }

    /**
     * @param $username
     * @return array|bool
     */
    public function getUserDetails($username)
    {
        if (!isset($this->userCredentials[$username])) {
            return false;
        }

        return array_merge(
            [
                'user_id' => $username,
                'password' => null,
                'first_name' => null,
                'last_name' => null,
            ],
            $this->userCredentials[$username]
        );
    }
}
