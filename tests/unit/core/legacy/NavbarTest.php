<?php

namespace App\Tests;

use App\Entity\Navbar;
use AspectMock\Test;
use Codeception\Test\Unit;
use Exception;
use SuiteCRM\Core\Legacy\ActionNameMapperHandler;
use SuiteCRM\Core\Legacy\ModuleNameMapperHandler;
use SuiteCRM\Core\Legacy\ModuleRegistryHandler;
use SuiteCRM\Core\Legacy\NavbarHandler;
use SuiteCRM\Core\Legacy\RouteConverterHandler;

final class NavbarTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var Navbar
     */
    protected $navbar;

    /**
     * @var NavbarHandler
     */
    private $navbarHandler;

    /**
     * @throws Exception
     * @noinspection StaticClosureCanBeUsedInspection
     */
    protected function _before(): void
    {
        $projectDir = $this->tester->getProjectDir();
        $legacyDir = $this->tester->getLegacyDir();
        $legacySessionName = $this->tester->getLegacySessionName();
        $defaultSessionName = $this->tester->getDefaultSessionName();

        $menuItemMap = [
            'default' => [
                'List' => [
                    'icon' => 'view'
                ],
                'View' => [
                    'icon' => 'view'
                ],
                'Add' => [
                    'icon' => 'plus'
                ],
                'Create' => [
                    'icon' => 'plus'
                ],
                'Import' => [
                    'icon' => 'download'
                ],
                'Security_Groups' => [
                    'icon' => 'view'
                ],
                'Schedule_Call' => [
                    'icon' => 'plus'
                ],
                'Schedule_Meetings' => [
                    'icon' => 'plus'
                ],
                'Schedule_Meeting' => [
                    'icon' => 'plus'
                ],
            ],
            'contacts' => [
                'Create_Contact_Vcard' => [
                    'icon' => 'plus'
                ],
            ],
            'leads' => [
                'Create_Lead_Vcard' => [
                    'icon' => 'plus'
                ],
            ],
        ];

        $legacyScope = $this->tester->getLegacyScope();

        $moduleNameMapper = new ModuleNameMapperHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope
        );

        $actionMapper = new ActionNameMapperHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope
        );

        $routeConverter = new RouteConverterHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $moduleNameMapper,
            $actionMapper
        );

        $mockAccessibleModulesList = [
            'Home' => 'Home',
            'Accounts' => 'Accounts',
            'Contacts' => 'Contacts',
            'Opportunities' => 'Opportunities',
            'Leads' => 'Leads',
            'Documents' => 'Documents',
        ];

        $mockDisplayEnabledModules = [
            'Home' => 'Home',
            'Accounts' => 'Accounts',
            'Contacts' => 'Contacts',
            'Leads' => 'Leads'
        ];

        $globalControlLinks = [
            'employees' => [
                'linkinfo' => [
                    'LBL_EMPLOYEES' => 'index.php?module=Employees&action=index',
                ],
                'submenu' => []
            ],
            'admin' => [
                'linkinfo' => [
                    'LBL_ADMIN' => 'index.php?module=Administration&action=index'
                ],
                'submenu' => []
            ],
            'training' => [
                'linkinfo' => [
                    'LBL_TRAINING' => 'https://community.suitecrm.com'
                ],
                'submenu' => []
            ],
            'users' => [
                'linkinfo' => [
                    'LBL_LOGOUT' => 'index.php?module=Users&action=Logout'
                ],
                'submenu' => []
            ],
            'about' => [
                'linkinfo' => [
                    'LNK_ABOUT' => 'index.php?module=Home&action=About'
                ],
                'submenu' => [],
            ]
        ];


        test::double(NavbarHandler::class, [
            'getAccessibleModulesList' => function () use ($mockAccessibleModulesList) {
                return $mockAccessibleModulesList;
            },
            'getDisplayEnabledModules' => function () use ($mockDisplayEnabledModules) {
                return $mockDisplayEnabledModules;
            },
            'getGlobalControlLinks' => function () use ($globalControlLinks) {
                return $globalControlLinks;
            },
            'switchSession' => function () {
            },
            'startLegacyApp' => function () {
            },
        ]);

        $excludedModules = [
            'EmailText',
            'TeamMemberships',
            'TeamSets',
            'TeamSetModule'
        ];

        $moduleRegistry = new ModuleRegistryHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $excludedModules
        );

        $this->navbarHandler = new NavbarHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScope,
            $menuItemMap,
            $moduleNameMapper,
            $routeConverter,
            $moduleRegistry
        );
        $this->navbar = $this->navbarHandler->getNavbar();
    }

    public function testGetUserActionMenu(): void
    {
        // Ordered array
        $expected = [
            [
                'name' => 'profile',
                'labelKey' => 'LBL_PROFILE',
                'url' => 'index.php?module=Users&action=EditView&record=',
                'icon' => '',
            ],
            [
                'name' => 'employees',
                'labelKey' => 'LBL_EMPLOYEES',
                'url' => 'index.php?module=Employees&action=index',
                'icon' => '',
            ],
            [
                'name' => 'training',
                'labelKey' => 'LBL_TRAINING',
                'url' => 'https://community.suitecrm.com',
                'icon' => '',
            ],
            [
                'name' => 'admin',
                'labelKey' => 'LBL_ADMIN',
                'url' => 'index.php?module=Administration&action=index',
                'icon' => ''
            ],
            [
                'name' => 'about',
                'labelKey' => 'LNK_ABOUT',
                'url' => 'index.php?module=Home&action=About',
                'icon' => '',
            ],
            [
                'name' => 'logout',
                'labelKey' => 'LBL_LOGOUT',
                'url' => 'index.php?module=Users&action=Logout',
                'icon' => '',
            ]
        ];

        static::assertSame(
            $expected,
            $this->navbar->userActionMenu
        );
    }

    public function testGetNonGroupedNavTabs(): void
    {
        $expected = [
            'home',
            'accounts',
            'contacts',
            'leads',
        ];

        static::assertSame(
            $expected,
            $this->navbar->tabs
        );
    }

    public function testGroupNavTabs(): void
    {
        $expected = [
            0 => [
                'name' => 'LBL_TABGROUP_SALES',
                'labelKey' => 'LBL_TABGROUP_SALES',
                // Ordered array
                'modules' => [
                    'home',
                    'accounts',
                    'contacts',
                    'leads',
                ]
            ],
            1 => [
                'name' => 'LBL_TABGROUP_MARKETING',
                'labelKey' => 'LBL_TABGROUP_MARKETING',
                // Ordered array
                'modules' => [
                    'home',
                    'accounts',
                    'contacts',
                    'leads',
                ]
            ],
            2 => [
                'name' => 'LBL_TABGROUP_SUPPORT',
                'labelKey' => 'LBL_TABGROUP_SUPPORT',
                // Ordered array
                'modules' => [
                    'home',
                    'accounts',
                    'contacts',
                ]
            ],
            3 => [
                'name' => 'LBL_TABGROUP_ACTIVITIES',
                'labelKey' => 'LBL_TABGROUP_ACTIVITIES',
                // Ordered array
                'modules' => [
                    'home',
                ]
            ],
            4 => [
                'name' => 'LBL_TABGROUP_COLLABORATION',
                'labelKey' => 'LBL_TABGROUP_COLLABORATION',
                // Ordered array
                'modules' => [
                    'home',
                ]
            ],
        ];

        static::assertSame(
            $expected,
            $this->navbar->groupedTabs
        );
    }

    public function testGetModule(): void
    {
        $expected = [
            'home' => [
                'path' => 'home',
                'defaultRoute' => './#/home',
                'name' => 'home',
                'labelKey' => 'Home',
                'menu' => []
            ],
            'accounts' => [
                'path' => 'accounts',
                'defaultRoute' => './#/accounts',
                'name' => 'accounts',
                'labelKey' => 'Accounts',
                'menu' => [
                    [
                        'name' => 'Create',
                        'labelKey' => 'LNK_NEW_ACCOUNT',
                        'url' => './#/accounts/edit',
                        'params' => [
                            'return_module' => 'Accounts',
                            'return_action' => 'index'
                        ],
                        'icon' => 'plus',
                        'module' => 'accounts'
                    ],
                    [
                        'name' => 'List',
                        'labelKey' => 'LNK_ACCOUNT_LIST',
                        'url' => './#/accounts/index',
                        'params' => [
                            'return_module' => 'Accounts',
                            'return_action' => 'DetailView'
                        ],
                        'icon' => 'view',
                        'module' => 'accounts'
                    ],
                    [
                        'name' => 'Import',
                        'labelKey' => 'LNK_IMPORT_ACCOUNTS',
                        'url' => './#/import/step1',
                        'params' => [
                            'import_module' => 'Accounts',
                            'return_module' => 'Accounts',
                            'return_action' => 'index'
                        ],
                        'icon' => 'download',
                        'module' => 'import'
                    ]
                ]
            ],
            'contacts' => [
                'path' => 'contacts',
                'defaultRoute' => './#/contacts',
                'name' => 'contacts',
                'labelKey' => 'Contacts',
                'menu' => [
                    [
                        'name' => 'Create',
                        'labelKey' => 'LNK_NEW_CONTACT',
                        'url' => './#/contacts/edit',
                        'params' => [
                            'return_module' => 'Contacts',
                            'return_action' => 'index'
                        ],
                        'icon' => 'plus',
                        'module' => 'contacts'
                    ],
                    [
                        'name' => 'Create_Contact_Vcard',
                        'labelKey' => 'LNK_IMPORT_VCARD',
                        'url' => './#/contacts/importvcard',
                        'params' => [],
                        'icon' => 'plus',
                        'module' => 'contacts'
                    ],
                    [
                        'name' => 'List',
                        'labelKey' => 'LNK_CONTACT_LIST',
                        'url' => './#/contacts/index',
                        'params' => [
                            'return_module' => 'Contacts',
                            'return_action' => 'DetailView'
                        ],
                        'icon' => 'view',
                        'module' => 'contacts'
                    ],
                    [
                        'name' => 'Import',
                        'labelKey' => 'LNK_IMPORT_CONTACTS',
                        'url' => './#/import/step1',
                        'params' => [
                            'import_module' => 'Contacts',
                            'return_module' => 'Contacts',
                            'return_action' => 'index'
                        ],
                        'icon' => 'download',
                        'module' => 'import'
                    ]
                ]
            ],
            'opportunities' => [
                'path' => 'opportunities',
                'defaultRoute' => './#/opportunities',
                'name' => 'opportunities',
                'labelKey' => 'Opportunities',
                'menu' => [
                    [
                        'name' => 'Create',
                        'labelKey' => 'LNK_NEW_OPPORTUNITY',
                        'url' => './#/opportunities/edit',
                        'params' => [
                            'return_module' => 'Opportunities',
                            'return_action' => 'DetailView'
                        ],
                        'icon' => 'plus',
                        'module' => 'opportunities'
                    ],
                    [
                        'name' => 'List',
                        'labelKey' => 'LNK_OPPORTUNITY_LIST',
                        'url' => './#/opportunities/index',
                        'params' => [
                            'return_module' => 'Opportunities',
                            'return_action' => 'DetailView'
                        ],
                        'icon' => 'view',
                        'module' => 'opportunities'
                    ],
                    [
                        'name' => 'Import',
                        'labelKey' => 'LNK_IMPORT_OPPORTUNITIES',
                        'url' => './#/import/step1',
                        'params' => [
                            'import_module' => 'Opportunities',
                            'return_module' => 'Opportunities',
                            'return_action' => 'index'
                        ],
                        'icon' => 'download',
                        'module' => 'import'
                    ]
                ]
            ],
            'leads' => [
                'path' => 'leads',
                'defaultRoute' => './#/leads',
                'name' => 'leads',
                'labelKey' => 'Leads',
                'menu' => [
                    [
                        'name' => 'Create',
                        'labelKey' => 'LNK_NEW_LEAD',
                        'url' => './#/leads/edit',
                        'params' => [
                            'return_module' => 'Leads',
                            'return_action' => 'DetailView'
                        ],
                        'icon' => 'plus',
                        'module' => 'leads'
                    ],
                    [
                        'name' => 'Create_Lead_Vcard',
                        'labelKey' => 'LNK_IMPORT_VCARD',
                        'url' => './#/leads/importvcard',
                        'params' => [],
                        'icon' => 'plus',
                        'module' => 'leads'
                    ],
                    [
                        'name' => 'List',
                        'labelKey' => 'LNK_LEAD_LIST',
                        'url' => './#/leads/index',
                        'params' => [
                            'return_module' => 'Leads',
                            'return_action' => 'DetailView'
                        ],
                        'icon' => 'view',
                        'module' => 'leads'
                    ],
                    [
                        'name' => 'Import',
                        'labelKey' => 'LNK_IMPORT_LEADS',
                        'url' => './#/import/step1',
                        'params' => [
                            'import_module' => 'Leads',
                            'return_module' => 'Leads',
                            'return_action' => 'index'
                        ],
                        'icon' => 'download',
                        'module' => 'import'
                    ]
                ]
            ],
            'documents' => [
                'path' => 'documents',
                'defaultRoute' => './#/documents',
                'name' => 'documents',
                'labelKey' => 'Documents',
                'menu' => [
                    [
                        'name' => 'Create',
                        'labelKey' => 'LNK_NEW_DOCUMENT',
                        'url' => './#/documents/edit',
                        'params' => [
                            'return_module' => 'Documents',
                            'return_action' => 'DetailView'
                        ],
                        'icon' => 'plus',
                        'module' => 'documents'
                    ],
                    [
                        'name' => 'List',
                        'labelKey' => 'LNK_DOCUMENT_LIST',
                        'url' => './#/documents/index',
                        'params' => [],
                        'icon' => 'view',
                        'module' => 'documents'
                    ]
                ]
            ],
        ];


        static::assertSame(
            $expected,
            $this->navbar->modules
        );
    }
}
