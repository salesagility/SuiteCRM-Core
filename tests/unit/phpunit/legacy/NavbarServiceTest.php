<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use SuiteCRM\Core\Legacy\Navbar;
use SuiteCRM\Core\Legacy\NavbarService;

final class NavbarServiceTest extends TestCase
{
    /**
     * @var NavbarService
     */
    private $navbarService;

    public function setUp()
    {
        $this->navbarService = new NavbarService();
    }

    public function testGetName(): void
    {
        $this->assertSame('template.navbar', $this->navbarService->getName());
    }

    public function testGetDescription(): void
    {
        $this->assertSame('This service will deal with retrieval of the navbar structure', $this->navbarService->getDescription());
    }

    public function testCreateService(): void
    {
        $this->assertInstanceOf(Navbar::class, $this->navbarService->createService());
    }
}


