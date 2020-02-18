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
        // Ordered array
        $expected = [
            'accounts',
            'am_projecttemplates',
            'aok_knowledge_base_categories',
            'aok_knowledgebase',
            'aor_reports',
            'aos_contracts',
            'aos_invoices',
            'aos_pdf_templates',
            'aos_product_categories',
            'aos_products',
            'aos_quotes',
            'aow_workflow',
            'calendar',
            'calls',
            'campaigns',
            'cases',
            'contacts',
            'documents',
            'emails',
            'emailtemplates',
            'fp_event_locations',
            'fp_events',
            'home',
            'jjwg_address_cache',
            'jjwg_areas',
            'jjwg_maps',
            'jjwg_markers',
            'leads',
            'meetings',
            'notes',
            'opportunities',
            'project',
            'prospectlists',
            'prospects',
            'spots',
            'surveys',
            'tasks',
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
