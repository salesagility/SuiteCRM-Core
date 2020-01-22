<?php

declare(strict_types=1);

use Codeception\Test\Unit;
use SuiteCRM\Core\Legacy\Navbar;
use SuiteCRM\Core\Legacy\NavbarService;

final class NavbarServiceTest extends Unit
{
    /**
     * @var NavbarService
     */
    private $navbarService;

    protected function setUp(): void
    {
        $this->navbarService = new NavbarService();
    }

    public function testGetName(): void
    {
        $this->assertSame('template.navbar', $this->navbarService->getName());
    }

    public function testGetDescription(): void
    {
        $this->assertSame('This service will deal with retrieval of the navbar structure',
            $this->navbarService->getDescription());
    }

    public function testCreateService(): void
    {
        $this->assertInstanceOf(Navbar::class, $this->navbarService->createService());
    }
}
