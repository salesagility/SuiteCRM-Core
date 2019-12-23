<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use SuiteCRM\Core\Legacy\Navbar;

final class NavbarTest extends TestCase
{
    /**
     * @var Navbar
     */
    private $navbar;

    public function setUp()
    {
        $this->navbar = new Navbar();
    }

    public function testGetUserActionMenu(): void
    {
        $expected = [
            0 => [
                'label' => 'Profile',
                'url' => 'index.php?module=Users&action=EditView&record=1',
                'submenu' => []
            ],
            1 => [
                'label' => 'Employees',
                'url' => 'index.php?module=Employees&action=index',
                'submenu' => []
            ],
            2 => [
                'label' => 'Support Forum',
                'url' => 'javascript:void(0)',
                'submenu' => [],
                'event' => [
                    'onClick' => "void(window.open('https://suitecrm.com/suitecrm/forum/suite-forum'))"
                ]
            ],
            3 => [
                'label' => 'About',
                'url' => 'index.php?module=Home&action=About',
                'submenu' => []
            ],
            4 => [
                'label' => 'Logout',
                'url' => 'index.php?module=Users&action=Logout',
                'submenu' => []
            ]
        ];

        $this->assertSame(
            $expected,
            $this->navbar->getUserActionMenu()
        );
    }
}
