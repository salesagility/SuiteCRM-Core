<?php

namespace App\Install\Service\Installation;

abstract class InstallStatus
{
    public const STARTED = -1;
    public const SUCCESS = 0;
    public const FAILED = 1;
    public const LOCKED = 2;
    public const VALIDATION_FAILED = 3;
    public const DB_CREDENTIALS_NOT_OK = 4;
    public const INVALID = 5;
}
