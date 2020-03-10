<?php

declare(strict_types=1);

use App\Entity\Navbar;
use Codeception\Test\Unit;
use SuiteCRM\Core\Legacy\NavbarHandler;

final class NavbarTest extends Unit
{
    /**
     * @var NavbarHandler
     */
    private $navbarHandler;

    /**
     * @var Navbar
     */
    protected $navbar;

    protected function _before()
    {
        $projectDir = codecept_root_dir();
        $legacyDir = $projectDir . '/legacy';
        $legacySessionName = 'LEGACYSESSID';
        $defaultSessionName = 'PHPSESSID';
        $this->navbarHandler = new NavbarHandler($projectDir, $legacyDir, $legacySessionName, $defaultSessionName);
        $this->navbar = $this->navbarHandler->getNavbar();
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
                'url' => 'https://community.suitecrm.com',
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
            $this->navbar->userActionMenu
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
            $this->navbar->NonGroupedTabs
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
            $this->navbar->groupedTabs
        );
    }

    public function testGetModuleSubmenus(): void
    {
        $expected = [
            'Home' => [],
            'Accounts' => [
                'Create Account' => 'index.php?module=Accounts&action=EditView&return_module=Accounts&return_action=index',
                'View Accounts' => 'index.php?module=Accounts&action=index&return_module=Accounts&return_action=DetailView',
                'Import Accounts' => 'index.php?module=Import&action=Step1&import_module=Accounts&return_module=Accounts&return_action=index'
            ],
            'Contacts' => [
                'Create Contact' => 'index.php?module=Contacts&action=EditView&return_module=Contacts&return_action=index',
                'Create Contact From vCard' => 'index.php?module=Contacts&action=ImportVCard',
                'View Contacts' => 'index.php?module=Contacts&action=index&return_module=Contacts&return_action=DetailView',
                'Import Contacts' => 'index.php?module=Import&action=Step1&import_module=Contacts&return_module=Contacts&return_action=index',
            ],
            'Opportunities' => [
                'Create Opportunity' => 'index.php?module=Opportunities&action=EditView&return_module=Opportunities&return_action=DetailView',
                'View Opportunities' => 'index.php?module=Opportunities&action=index&return_module=Opportunities&return_action=DetailView',
                'Import Opportunities' => 'index.php?module=Import&action=Step1&import_module=Opportunities&return_module=Opportunities&return_action=index',
            ],
            'Leads' => [
                'Create Lead' => 'index.php?module=Leads&action=EditView&return_module=Leads&return_action=DetailView',
                'Create Lead From vCard' => 'index.php?module=Leads&action=ImportVCard',
                'View Leads' => 'index.php?module=Leads&action=index&return_module=Leads&return_action=DetailView',
                'Import Leads' => 'index.php?module=Import&action=Step1&import_module=Leads&return_module=Leads&return_action=index',
            ],
            'AOS_Quotes' => [
                'Create Quote' => 'index.php?module=AOS_Quotes&action=EditView&return_module=AOS_Quotes&return_action=DetailView',
                'View Quotes' => 'index.php?module=AOS_Quotes&action=index&return_module=AOS_Quotes&return_action=DetailView',
                'Import' => 'index.php?module=Import&action=Step1&import_module=AOS_Quotes&return_module=AOS_Quotes&return_action=index',
                'Import Line Items' => 'index.php?module=Import&action=Step1&import_module=AOS_Products_Quotes&return_module=AOS_Quotes&return_action=index',
            ],
            'Calendar' => [
                'Schedule Meeting' => 'index.php?module=Meetings&action=EditView&return_module=Meetings&return_action=DetailView',
                'Schedule Call' => 'index.php?module=Calls&action=EditView&return_module=Calls&return_action=DetailView',
                'Create Task' => 'index.php?module=Tasks&action=EditView&return_module=Tasks&return_action=DetailView',
                'Today' => 'index.php?module=Calendar&action=index&view=day',
            ],
            'Documents' => [
                'Create Document' => 'index.php?module=Documents&action=EditView&return_module=Documents&return_action=DetailView',
                'View Documents' => 'index.php?module=Documents&action=index',
            ],
            'Emails' => [
                'Compose' => 'index.php?module=Emails&action=ComposeView&return_module=Emails&return_action=index',
                'View Email' => 'index.php?module=Emails&action=index&return_module=Emails&return_action=DetailView',
            ],
            'Spots' => [
                'Create Spot' => 'index.php?module=Spots&action=EditView',
                'View Spots' => 'index.php?module=Spots&action=index',
            ],
            'Campaigns' => [
                'Create Campaign' => 'index.php?module=Campaigns&action=WizardHome&return_module=Campaigns&return_action=index',
                'View Campaigns' => 'index.php?module=Campaigns&action=index&return_module=Campaigns&return_action=index',
                'Create Email Template' => 'index.php?module=EmailTemplates&action=EditView&return_module=EmailTemplates&return_action=DetailView',
                'View Email Templates' => 'index.php?module=EmailTemplates&action=index',
                'View Diagnostics' => 'index.php?module=Campaigns&action=CampaignDiagnostic&return_module=Campaigns&return_action=index',
                'Create Person Form' => 'index.php?module=Campaigns&action=WebToLeadCreation&return_module=Campaigns&return_action=index',
                'Import Campaigns' => 'index.php?module=Import&action=Step1&import_module=Campaigns&return_module=Campaigns&return_action=index',
            ],
            'Calls' => [
                'Log Call' => 'index.php?module=Calls&action=EditView&return_module=Calls&return_action=DetailView',
                'View Calls' => 'index.php?module=Calls&action=index&return_module=Calls&return_action=DetailView',
                'Import Calls' => 'index.php?module=Import&action=Step1&import_module=Calls&return_module=Calls&return_action=index',
            ],
            'Meetings' => [
                'Schedule Meeting' => 'index.php?module=Meetings&action=EditView&return_module=Meetings&return_action=DetailView',
                'View Meetings' => 'index.php?module=Meetings&action=index&return_module=Meetings&return_action=DetailView',
                'Import Meetings' => 'index.php?module=Import&action=Step1&import_module=Meetings&return_module=Meetings&return_action=index',
            ],
            'Tasks' => [
                'Create Task' => 'index.php?module=Tasks&action=EditView&return_module=Tasks&return_action=DetailView',
                'View Tasks' => 'index.php?module=Tasks&action=index&return_module=Tasks&return_action=DetailView',
                'Import Tasks' => 'index.php?module=Import&action=Step1&import_module=Tasks&return_module=Tasks&return_action=index',
            ],
            'Notes' => [
                'Create Note or Attachment' => 'index.php?module=Notes&action=EditView&return_module=Notes&return_action=DetailView',
                'View Notes' => 'index.php?module=Notes&action=index&return_module=Notes&return_action=DetailView',
                'Import Notes' => 'index.php?module=Import&action=Step1&import_module=Notes&return_module=Notes&return_action=index',
            ],
            'AOS_Invoices' => [
                'Create Invoice' => 'index.php?module=AOS_Invoices&action=EditView&return_module=AOS_Invoices&return_action=DetailView',
                'View Invoices' => 'index.php?module=AOS_Invoices&action=index&return_module=AOS_Invoices&return_action=DetailView',
                'Import' => 'index.php?module=Import&action=Step1&import_module=AOS_Invoices&return_module=AOS_Invoices&return_action=index',
                'Import Line Items' => 'index.php?module=Import&action=Step1&import_module=AOS_Products_Quotes&return_module=AOS_Invoices&return_action=index',
            ],
            'AOS_Contracts' => [
                'Create Contract' => 'index.php?module=AOS_Contracts&action=EditView&return_module=AOS_Contracts&return_action=DetailView',
                'View Contracts' => 'index.php?module=AOS_Contracts&action=index&return_module=AOS_Contracts&return_action=DetailView',
                'Import' => 'index.php?module=Import&action=Step1&import_module=AOS_Contracts&return_module=AOS_Contracts&return_action=index',
            ],
            'Cases' => [
                'Create Case' => 'index.php?module=Cases&action=EditView&return_module=Cases&return_action=DetailView',
                'View Cases' => 'index.php?module=Cases&action=index&return_module=Cases&return_action=DetailView',
                'Import Cases' => 'index.php?module=Import&action=Step1&import_module=Cases&return_module=Cases&return_action=index',
            ],
            'Prospects' => [
                'Create Target' => 'index.php?module=Prospects&action=EditView&return_module=Prospects&return_action=DetailView',
                'View Targets' => 'index.php?module=Prospects&action=index&return_module=Prospects&return_action=index',
                'Import Targets' => 'index.php?module=Import&action=Step1&import_module=Prospects&return_module=Prospects&return_action=index',
            ],
            'ProspectLists' => [
                'Create Target List' => 'index.php?module=ProspectLists&action=EditView&return_module=ProspectLists&return_action=DetailView',
                'View Target Lists' => 'index.php?module=ProspectLists&action=index&return_module=ProspectLists&return_action=index',
            ],
            'Project' => [
                'Create Project' => 'index.php?module=Project&action=EditView&return_module=Project&return_action=DetailView',
                'View Project List' => 'index.php?module=Project&action=index',
                'Resource Calendar' => 'index.php?module=Project&action=ResourceList',
                'View Project Tasks' => 'index.php?module=ProjectTask&action=index',
            ],
            'AM_ProjectTemplates' => [
                'Create Project Templates' => 'index.php?module=AM_ProjectTemplates&action=EditView&return_module=AM_ProjectTemplates&return_action=index',
                'View Project Templates' => 'index.php?module=AM_ProjectTemplates&action=index&return_module=AM_ProjectTemplates&return_action=DetailView',
                'Import Project Templates' => 'index.php?module=Import&action=Step1&import_module=AM_ProjectTemplates&return_module=AM_ProjectTemplates&return_action=index',
            ],
            'FP_events' => [
                'Create Event' => 'index.php?module=FP_events&action=EditView&return_module=FP_events&return_action=DetailView',
                'View Events' => 'index.php?module=FP_events&action=index&return_module=FP_events&return_action=DetailView',
                'Import' => 'index.php?module=Import&action=Step1&import_module=FP_events&return_module=FP_events&return_action=index',
            ],
            'FP_Event_Locations' => [
                'Create Locations' => 'index.php?module=FP_Event_Locations&action=EditView&return_module=FP_Event_Locations&return_action=DetailView',
                'View Locations' => 'index.php?module=FP_Event_Locations&action=index',
            ],
            'AOS_Products' => [
                'Create Product' => 'index.php?module=AOS_Products&action=EditView&return_module=AOS_Products&return_action=DetailView',
                'View Products' => 'index.php?module=AOS_Products&action=index&return_module=AOS_Products&return_action=DetailView',
                'Import' => 'index.php?module=Import&action=Step1&import_module=AOS_Products&return_module=AOS_Products&return_action=index',
            ],
            'AOS_Product_Categories' => [
                'Create Product Categories' => 'index.php?module=AOS_Product_Categories&action=EditView&return_module=AOS_Product_Categories&return_action=DetailView',
                'View Product Categories' => 'index.php?module=AOS_Product_Categories&action=index&return_module=AOS_Product_Categories&return_action=DetailView',
                'Import' => 'index.php?module=Import&action=Step1&import_module=AOS_Product_Categories&return_module=AOS_Product_Categories&return_action=index',
            ],
            'AOS_PDF_Templates' => [
                'Create PDF Template' => 'index.php?module=AOS_PDF_Templates&action=EditView&return_module=AOS_PDF_Templates&return_action=DetailView',
                'View PDF Templates' => 'index.php?module=AOS_PDF_Templates&action=index&return_module=AOS_PDF_Templates&return_action=DetailView',
                'Import' => 'index.php?module=Import&action=Step1&import_module=AOS_PDF_Templates&return_module=AOS_PDF_Templates&return_action=index',
            ],
            'jjwg_Maps' => [
                'Add New Map' => 'index.php?module=jjwg_Maps&action=EditView&return_module=jjwg_Maps&return_action=index',
                'List Maps' => 'index.php?module=jjwg_Maps&action=index&return_module=jjwg_Maps&return_action=DetailView',
                'Quick Radius Map' => 'index.php?module=jjwg_Maps&action=quick_radius&return_module=jjwg_Maps&return_action=index',
                'Import' => 'index.php?module=Import&action=Step1&import_module=jjwg_Maps&return_module=jjwg_Maps&return_action=index',
            ],
            'jjwg_Markers' => [
                'Create Markers' => 'index.php?module=jjwg_Markers&action=EditView',
                'View Markers' => 'index.php?module=jjwg_Markers&action=index',
                'Import Markers' => 'index.php?module=jjwg_Markers&action=index',
            ],
            'jjwg_Areas' => [
                'Create Areas' => 'index.php?module=jjwg_Areas&action=EditView&return_module=jjwg_Areas&return_action=index',
                'View Areas' => 'index.php?module=jjwg_Areas&action=index&return_module=jjwg_Areas&return_action=DetailView',
                'Import' => 'index.php?module=Import&action=Step1&import_module=jjwg_Areas&return_module=jjwg_Areas&return_action=index',
            ],
            'jjwg_Address_Cache' => [
                'Create Address Cache' => 'index.php?module=jjwg_Address_Cache&action=EditView&return_module=jjwg_Address_Cache&return_action=DetailView',
                'View Address Cache' => 'index.php?module=jjwg_Address_Cache&action=index&return_module=jjwg_Address_Cache&return_action=DetailView',
                'Import' => 'index.php?module=Import&action=Step1&import_module=jjwg_Address_Cache&return_module=jjwg_Address_Cache&return_action=index',
            ],
            'AOR_Reports' => [
                'Create Report' => 'index.php?module=AOR_Reports&action=EditView&return_module=AOR_Reports&return_action=DetailView',
                'View Reports' => 'index.php?module=AOR_Reports&action=index&return_module=AOR_Reports&return_action=DetailView',
                'Import' => 'index.php?module=Import&action=Step1&import_module=AOR_Reports&return_module=AOR_Reports&return_action=index',
            ],
            'AOW_WorkFlow' => [
                'Create WorkFlow' => 'index.php?module=AOW_WorkFlow&action=EditView&return_module=AOW_WorkFlow&return_action=DetailView',
                'View WorkFlow' => 'index.php?module=AOW_WorkFlow&action=index&return_module=AOW_WorkFlow&return_action=DetailView',
                'View Process Audit' => 'index.php?module=AOW_Processed&action=index&return_module=AOW_Processed&return_action=DetailView',
            ],
            'AOK_KnowledgeBase' => [
                'Create Knowledge Base' => 'index.php?module=AOK_KnowledgeBase&action=EditView',
                'View Knowledge Base' => 'index.php?module=AOK_KnowledgeBase&action=index',
            ],
            'AOK_Knowledge_Base_Categories' => [
                'Create KB Categories' => 'index.php?module=AOK_Knowledge_Base_Categories&action=EditView',
                'View KB Categories' => 'index.php?module=AOK_Knowledge_Base_Categories&action=index',
            ],
            'EmailTemplates' => [
                'Create Email Template' => 'index.php?module=EmailTemplates&action=EditView&return_module=EmailTemplates&return_action=DetailView',
                'View Email Templates' => 'index.php?module=EmailTemplates&action=index',
            ],
            'Surveys' => [
                'Create Surveys' => 'index.php?module=Surveys&action=EditView&return_module=Surveys&return_action=DetailView',
                'View Surveys' => 'index.php?module=Surveys&action=index&return_module=Surveys&return_action=DetailView',
            ],
        ];

        $this->assertSame(
            $expected,
            $this->navbar->moduleSubmenus
        );
    }
}
