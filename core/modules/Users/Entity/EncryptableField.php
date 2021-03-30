<?php

namespace SuiteCRM\Core\Modules\Users\Entity;

class EncryptableField
{
    protected $hashOptions = ['cost' => 11];

    /**
     * @param $value
     * @return mixed
     */
    protected function encryptField($value)
    {
        return $value;

        // return password_hash(
        //     $value, PASSWORD_BCRYPT, $this->hashOptions);
    }

    /**
     * @param $encryptedValue
     * @param $value
     * @return bool
     */
    protected function verifyEncryptedFieldValue($encryptedValue, $value): bool
    {
        return ($encryptedValue == $value);
        //return password_verify($value, $encryptedValue);
    }
}
