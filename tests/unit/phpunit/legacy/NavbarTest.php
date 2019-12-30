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

    public function testGetNonGroupedNavTabs(): void
    {
        $expected = [
            'Home' => 'Home',
            'Accounts' => 'Accounts',
            'Contacts' => 'Contacts',
            'Opportunities' => 'Opportunities',
            'Leads' => 'Leads',
            'AOS_Quotes' => 'AOS_Quotes',
            'Calendar' => 'Calendar',
            'Documents' => 'Documents',
            'Emails' => 'Emails',
            'Spots' => 'Spots',
            'Campaigns' => 'Campaigns',
            'Calls' => 'Calls',
            'Meetings' => 'Meetings',
            'Tasks' => 'Tasks',
            'Notes' => 'Notes',
            'AOS_Invoices' => 'AOS_Invoices',
            'AOS_Contracts' => 'AOS_Contracts',
            'Cases' => 'Cases',
            'Prospects' => 'Prospects',
            'ProspectLists' => 'ProspectLists',
            'Project' => 'Project',
            'AM_ProjectTemplates' => 'AM_ProjectTemplates',
            'FP_events' => 'FP_events',
            'FP_Event_Locations' => 'FP_Event_Locations',
            'AOS_Products' => 'AOS_Products',
            'AOS_Product_Categories' => 'AOS_Product_Categories',
            'AOS_PDF_Templates' => 'AOS_PDF_Templates',
            'jjwg_Maps' => 'jjwg_Maps',
            'jjwg_Markers' => 'jjwg_Markers',
            'jjwg_Areas' => 'jjwg_Areas',
            'jjwg_Address_Cache' => 'jjwg_Address_Cache',
            'AOR_Reports' => 'AOR_Reports',
            'AOW_WorkFlow' => 'AOW_WorkFlow',
            'AOK_KnowledgeBase' => 'AOK_KnowledgeBase',
            'AOK_Knowledge_Base_Categories' => 'AOK_Knowledge_Base_Categories',
            'EmailTemplates' => 'EmailTemplates',
            'Surveys' => 'Surveys'
        ];

        $this->assertSame(
            $expected,
            $this->navbar->getNonGroupedNavTabs()
        );
    }
}
