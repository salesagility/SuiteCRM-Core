<?php

declare(strict_types=1);

use Codeception\Test\Unit;
use SuiteCRM\Core\Legacy\Navbar;

final class NavbarTest extends Unit
{
    /**
     * @var Navbar
     */
    private $navbar;

    protected function _before()
    {
        $this->navbar = new Navbar();
    }

    public function testGetUserActionMenu(): void
    {
        // Ordered array
        $expected = [
            0 => [
                'name' => 'profile',
                'labelKey' => 'LBL_PROFILE',
                'url' => 'index.php?module=Users&action=EditView&record=1',
                'icon' => '',
            ],
            1 => [
                'name' => 'employees',
                'labelKey' => 'LBL_EMPLOYEES',
                'url' => 'index.php?module=Employees&action=index',
                'icon' => '',
            ],
            2 => [
                'name' => 'support forum',
                'labelKey' => 'LBL_TRAINING',
                'url' => 'javascript:void(window.open(\'https://suitecrm.com/suitecrm/forum/suite-forum\'))',
                'icon' => '',
            ],
            3 => [
                'name' => 'about',
                'labelKey' => 'LNK_ABOUT',
                'url' => 'index.php?module=Home&action=About',
                'icon' => '',
            ],
            4 => [
                'name' => 'logout',
                'labelKey' => 'LBL_LOGOUT',
                'url' => 'index.php?module=Users&action=Logout',
                'icon' => '',
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
            'Home' => 'home',
            'Accounts' => 'accounts',
            'Contacts' => 'contacts',
            'Opportunities' => 'opportunities',
            'Leads' => 'leads',
            'AOS_Quotes' => 'aos_quotes',
            'Calendar' => 'calendar',
            'Documents' => 'documents',
            'Emails' => 'emails',
            'Spots' => 'spots',
            'Campaigns' => 'campaigns',
            'Calls' => 'calls',
            'Meetings' => 'meetings',
            'Tasks' => 'tasks',
            'Notes' => 'notes',
            'AOS_Invoices' => 'aos_invoices',
            'AOS_Contracts' => 'aos_contracts',
            'Cases' => 'cases',
            'Prospects' => 'prospects',
            'ProspectLists' => 'prospectlists',
            'Project' => 'project',
            'AM_ProjectTemplates' => 'am_projecttemplates',
            'FP_events' => 'fp_events',
            'FP_Event_Locations' => 'fp_event_locations',
            'AOS_Products' => 'aos_products',
            'AOS_Product_Categories' => 'aos_product_categories',
            'AOS_PDF_Templates' => 'aos_pdf_templates',
            'jjwg_Maps' => 'jjwg_maps',
            'jjwg_Markers' => 'jjwg_markers',
            'jjwg_Areas' => 'jjwg_areas',
            'jjwg_Address_Cache' => 'jjwg_address_cache',
            'AOR_Reports' => 'aor_reports',
            'AOW_WorkFlow' => 'aow_workflow',
            'AOK_KnowledgeBase' => 'aok_knowledgebase',
            'AOK_Knowledge_Base_Categories' => 'aok_knowledge_base_categories',
            'EmailTemplates' => 'emailtemplates',
            'Surveys' => 'surveys'
        ];

        $this->assertSame(
            $expected,
            $this->navbar->getNonGroupedNavTabs()
        );
    }

    public function testGroupNavTabs(): void
    {
        $expected = [
            0 => [
                'name' => 'sales',
                'labelKey' => 'LBL_TABGROUP_SALES',
                // Ordered array
                'modules' => [
                    'accounts',
                    'contacts',
                    'home',
                    'leads',
                    'opportunities',
                ]
            ],
            1 => [
                'name' => 'marketing',
                'labelKey' => 'LBL_TABGROUP_MARKETING',
                // Ordered array
                'modules' => [
                    'accounts',
                    'campaigns',
                    'contacts',
                    'home',
                    'leads',
                    'targets',
                    'targets - lists',
                ]
            ],
            2 => [
                'name' => 'support',
                'labelKey' => 'LBL_TABGROUP_SUPPORT',
                // Ordered array
                'modules' => [
                    'accounts',
                    'bugs',
                    'cases',
                    'contacts',
                    'home',
                ]
            ],
            3 => [
                'name' => 'activities',
                'labelKey' => 'LBL_TABGROUP_ACTIVITIES',
                // Ordered array
                'modules' => [
                    'calendar',
                    'calls',
                    'emails',
                    'home',
                    'meetings',
                    'notes',
                    'tasks',
                ]
            ],
            4 => [
                'name' => 'collaboration',
                'labelKey' => 'LBL_TABGROUP_COLLABORATION',
                // Ordered array
                'modules' => [
                    'documents',
                    'emails',
                    'home',
                    'projects',
                ]
            ],
        ];

        $this->assertSame(
            $expected,
            $this->navbar->getGroupedNavTabs()
        );
    }
}
