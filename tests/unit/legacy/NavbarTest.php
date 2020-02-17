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
