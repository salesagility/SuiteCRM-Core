<?php

declare(strict_types=1);

use SuiteCRM\Core\Base\Config\Manager as ConfigManager;

use SuiteCRM\Core\Base\Instance;

use PHPUnit\Framework\TestCase;
use SuiteCRM\Core\Legacy\AuthenticationService;
use SuiteCRM\Core\Legacy\Authentication;

final class AuthenticationServiceTest extends TestCase
{
    public function setUp()
    {
        $this->authenticationService = new AuthenticationService();
    }

    public function testGetName(): void
    {
        $this->assertSame('users.authentication', $this->authenticationService->getName());
    }

    public function testGetDescription(): void
    {
        $this->assertSame(
            'This service will deal with legacy authentication',
            $this->authenticationService->getDescription()
        );
    }

    public function testCreateService(): void
    {
        $this->assertInstanceOf(Authentication::class, $this->authenticationService->createService());
    }
}



