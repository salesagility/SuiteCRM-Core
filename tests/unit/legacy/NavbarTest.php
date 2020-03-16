<?php

declare(strict_types=1);

use App\Entity\Navbar;
use App\Service\ModuleNameMapper;
use App\Service\RouteConverter;
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

        $legacyModuleNameMap = [
            'Home' => [
                'frontend' => 'home',
                'core' => 'Home',
            ],
            'Calendar' => [
                'frontend' => 'calendar',
                'core' => 'Calendar',
            ],
            'Calls' => [
                'frontend' => 'calls',
                'core' => 'Calls',
            ],
            'Calls_Reschedule' => [
                'frontend' => 'calls-reschedule',
                'core' => 'CallsReschedule',
            ],
            'Meetings' => [
                'frontend' => 'meetings',
                'core' => 'Meetings',
            ],
            'Tasks' => [
                'frontend' => 'tasks',
                'core' => 'Tasks',
            ],
            'Notes' => [
                'frontend' => 'notes',
                'core' => 'Notes',
            ],
            'Leads' => [
                'frontend' => 'leads',
                'core' => 'Leads',
            ],
            'Contacts' => [
                'frontend' => 'contacts',
                'core' => 'Contacts',
            ],
            'Accounts' => [
                'frontend' => 'accounts',
                'core' => 'Accounts',
            ],
            'Opportunities' => [
                'frontend' => 'opportunities',
                'core' => 'Opportunities',
            ],
            'Import' => [
                'frontend' => 'import',
                'core' => 'Import',
            ],
            'Emails' => [
                'frontend' => 'emails',
                'core' => 'Emails',
            ],
            'EmailTemplates' => [
                'frontend' => 'email-templates',
                'core' => 'EmailTemplates',
            ],
            'Campaigns' => [
                'frontend' => 'campaigns',
                'core' => 'Campaigns',
            ],
            'Targets' => [
                'frontend' => 'targets',
                'core' => 'Targets',
            ],
            'Targets - Lists' => [
                'frontend' => 'prospect-lists',
                'core' => 'ProspectLists',
            ],
            'Prospects' => [
                'frontend' => 'prospects',
                'core' => 'Prospects',
            ],
            'ProspectLists' => [
                'frontend' => 'prospect-lists',
                'core' => 'ProspectLists',
            ],
            'Documents' => [
                'frontend' => 'documents',
                'core' => 'Documents',
            ],
            'Cases' => [
                'frontend' => 'cases',
                'core' => 'Cases',
            ],
            'Project' => [
                'frontend' => 'project',
                'core' => 'Project',
            ],
            'ProjectTask' => [
                'frontend' => 'project-task',
                'core' => 'ProjectTask',
            ],
            'Bugs' => [
                'frontend' => 'bugs',
                'core' => 'Bugs',
            ],
            'ResourceCalendar' => [
                'frontend' => 'resource-calendar',
                'core' => 'ResourceCalendar',
            ],
            'AOBH_BusinessHours' => [
                'frontend' => 'business-hours',
                'core' => 'BusinessHours',
            ],
            'Spots' => [
                'frontend' => 'spots',
                'core' => 'Spots',
            ],
            'SecurityGroups' => [
                'frontend' => 'security-groups',
                'core' => 'SecurityGroups',
            ],
            'ACL' => [
                'frontend' => 'acl',
                'core' => 'ACL',
            ],
            'ACLRoles' => [
                'frontend' => 'acl-roles',
                'core' => 'ACLRoles',
            ],
            'Configurator' => [
                'frontend' => 'configurator',
                'core' => 'Configurator',
            ],
            'UserPreferences' => [
                'frontend' => 'user-preferences',
                'core' => 'UserPreferences',
            ],
            'SavedSearch' => [
                'frontend' => 'saved-search',
                'core' => 'SavedSearch',
            ],
            'Studio' => [
                'frontend' => 'studio',
                'core' => 'Studio',
            ],
            'Connectors' => [
                'frontend' => 'connectors',
                'core' => 'Connectors',
            ],
            'SugarFeed' => [
                'frontend' => 'sugar-feed',
                'core' => 'SugarFeed',
            ],
            'EAPM' => [
                'frontend' => 'eapm',
                'core' => 'EAPM',
            ],
            'OutboundEmailAccounts' => [
                'frontend' => 'outbound-email-accounts',
                'core' => 'OutboundEmailAccounts',
            ],
            'TemplateSectionLine' => [
                'frontend' => 'template-section-line',
                'core' => 'TemplateSectionLine',
            ],
            'OAuthKeys' => [
                'frontend' => 'oauth-keys',
                'core' => 'OAuthKeys',
            ],
            'OAuthTokens' => [
                'frontend' => 'oauth-tokens',
                'core' => 'OAuthTokens',
            ],
            'OAuth2Tokens' => [
                'frontend' => 'oauth2-tokens',
                'core' => 'OAuth2Tokens',
            ],
            'OAuth2Clients' => [
                'frontend' => 'oauth2-clients',
                'core' => 'OAuth2Clients',
            ],
            'Surveys' => [
                'frontend' => 'surveys',
                'core' => 'Surveys',
            ],
            'SurveyResponses' => [
                'frontend' => 'survey-responses',
                'core' => 'SurveyResponses',
            ],
            'SurveyQuestionResponses' => [
                'frontend' => 'survey-question-responses',
                'core' => 'SurveyQuestionResponses',
            ],
            'SurveyQuestions' => [
                'frontend' => 'survey-questions',
                'core' => 'SurveyQuestions',
            ],
            'SurveyQuestionOptions' => [
                'frontend' => 'survey-question-options',
                'core' => 'SurveyQuestionOptions',
            ],
            'Reminders' => [
                'frontend' => 'reminders',
                'core' => 'Reminders',
            ],
            'Reminders_Invitees' => [
                'frontend' => 'reminders-invitees',
                'core' => 'RemindersInvitees',
            ],
            'AM_ProjectTemplates' => [
                'frontend' => 'project-templates',
                'core' => 'ProjectTemplates',
            ],
            'AM_TaskTemplates' => [
                'frontend' => 'task-templates',
                'core' => 'TaskTemplates',
            ],
            'AOK_Knowledge_Base_Categories' => [
                'frontend' => 'knowledge-base-categories',
                'core' => 'KnowledgeBaseCategories',
            ],
            'AOK_KnowledgeBase' => [
                'frontend' => 'knowledge-base',
                'core' => 'KnowledgeBase',
            ],
            'FP_events' => [
                'frontend' => 'events',
                'core' => 'Events',
            ],
            'FP_Event_Locations' => [
                'frontend' => 'event-locations',
                'core' => 'EventLocations',
            ],
            'AOS_Contracts' => [
                'frontend' => 'contracts',
                'core' => 'Contracts',
            ],
            'AOS_Invoices' => [
                'frontend' => 'invoices',
                'core' => 'Invoices',
            ],
            'AOS_PDF_Templates' => [
                'frontend' => 'pdf-templates',
                'core' => 'PDFTemplates',
            ],
            'AOS_Product_Categories' => [
                'frontend' => 'product-categories',
                'core' => 'ProductCategories',
            ],
            'AOS_Products' => [
                'frontend' => 'products',
                'core' => 'Products',
            ],
            'AOS_Quotes' => [
                'frontend' => 'quotes',
                'core' => 'Quotes',
            ],
            'AOS_Products_Quotes' => [
                'frontend' => 'products-quotes',
                'core' => 'ProductsQuotes',
            ],
            'AOS_Line_Item_Groups' => [
                'frontend' => 'line-item-groups',
                'core' => 'LineItemGroups',
            ],
            'jjwg_Maps' => [
                'frontend' => 'maps',
                'core' => 'Maps',
            ],
            'jjwg_Markers' => [
                'frontend' => 'markers',
                'core' => 'Markers',
            ],
            'jjwg_Areas' => [
                'frontend' => 'areas',
                'core' => 'Areas',
            ],
            'jjwg_Address_Cache' => [
                'frontend' => 'address-cache',
                'core' => 'AddressCache',
            ],
            'AOD_IndexEvent' => [
                'frontend' => 'index-event',
                'core' => 'IndexEvent',
            ],
            'AOD_Index' => [
                'frontend' => 'index',
                'core' => 'index',
            ],
            'AOP_Case_Events' => [
                'frontend' => 'case-events',
                'core' => 'CaseEvents',
            ],
            'AOP_Case_Updates' => [
                'frontend' => 'case-updates',
                'core' => 'CaseUpdates',
            ],
            'AOR_Reports' => [
                'frontend' => 'reports',
                'core' => 'Reports',
            ],
            'AOR_Scheduled_Reports' => [
                'frontend' => 'scheduled-reports',
                'core' => 'ScheduledReports',
            ],
            'AOR_Fields' => [
                'frontend' => 'report-fields',
                'core' => 'ReportFields',
            ],
            'AOR_Charts' => [
                'frontend' => 'report-charts',
                'core' => 'ReportCharts',
            ],
            'AOR_Conditions' => [
                'frontend' => 'report-conditions',
                'core' => 'ReportConditions',
            ],
            'AOW_WorkFlow' => [
                'frontend' => 'workflow',
                'core' => 'WorkFlow',
            ],
            'AOW_Actions' => [
                'frontend' => 'workflow-actions',
                'core' => 'WorkflowActions',
            ],
            'AOW_Processed' => [
                'frontend' => 'workflow-processed',
                'core' => 'WorflowProcessed',
            ],
            'AOW_Conditions' => [
                'frontend' => 'workflow-conditions',
                'core' => 'WorkflowConditions',
            ],
        ];

        $legacyActionNameMap = [
            'index' => 'index',
            'multieditview' => 'multieditview',
            'detailview' => 'detail',
            'editview' => 'edit',
            'listview' => 'list',
            'popup' => 'popup',
            'vcard' => 'vcard',
            'importvcard' => 'importvcard',
            'modulelistmenu' => 'modulelistmenu',
            'favorites' => 'favorites',
            'noaccess' => 'noaccess',
            'step1' => 'step1',
            'composeview' => 'compose',
            'wizardhome' => 'wizard-home',
            'campaigndiagnostic' => 'diagnostic',
            'webtoleadcreation' => 'web-to-lead',
            'resourcelist' => 'resource-list',
            'quick_radius' => 'quick-radius',
        ];

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
            'calls' => [
                'Calls' => [
                    'icon' => 'plus'
                ],
            ],
            'calendar' => [
                'Calendar' => [
                    'icon' => 'plus'
                ],
                'Today' => [
                    'icon' => 'calendar'
                ],
            ],
            'workflow' => [
                'View_Process_Audit' => [
                    'icon' => 'view'
                ],
            ],
            'workflow-processed' => [
                'View_Process_Audit' => [
                    'icon' => 'view'
                ],
            ],
            'mail-merge' => [
                'Documents' => [
                    'icon' => 'view'
                ],
            ],
            'email-templates' => [
                'View_Email_Templates' => [
                    'icon' => 'view'
                ],
                'View_Create_Email_Templates' => [
                    'icon' => 'plus'
                ],
            ],
            'campaigns' => [
                'View_Create_Email_Templates' => [
                    'icon' => 'plus'
                ],
                'View_Email_Templates' => [
                    'icon' => 'view'
                ],
                'Setup_Email' => [
                    'icon' => 'email'
                ],
                'View_Diagnostics' => [
                    'icon' => 'view'
                ],
                'Create_Person_Form' => [
                    'icon' => 'person'
                ],
            ],
            'leads' => [
                'Create_Lead_Vcard' => [
                    'icon' => 'plus'
                ],
            ],
            'inbound-email' => [
                'Setup_Email' => [
                    'icon' => 'email'
                ],
            ],
            'schedulers' => [
                'Schedulers' => [
                    'icon' => 'view'
                ],
            ],
            'address-cache' => [
                'Createjjwg_Address_Cache' => [
                    'icon' => 'plus'
                ],
                'jjwg_Address_Cache' => [
                    'icon' => 'view'
                ],
            ],
            'maps' => [
                'List_Maps' => [
                    'icon' => 'view'
                ],
                'Quick_Radius_Map' => [
                    'icon' => 'view'
                ],
            ],
            'security-groups' => [
                'Create_Security_Group' => [
                    'icon' => 'plus'
                ],
                'Security_Groups' => [
                    'icon' => 'view'
                ],
                'Security_Suite_Settings' => [
                    'icon' => 'padlock'
                ],
                'Role_Management' => [
                    'icon' => 'view'
                ],
            ],
            'acl-roles' => [
                'Role_Management' => [
                    'icon' => 'view'
                ],
            ],
            'connectors' => [
                'icon_Connectors' => [
                    'icon' => 'view'
                ],
                'icon_ConnectorConfig_16' => [
                    'icon' => 'view'
                ],
                'icon_ConnectorEnable_16' => [
                    'icon' => 'view'
                ],
                'icon_ConnectorMap_16' => [
                    'icon' => 'view'
                ],
            ],
            'configurator' => [
                'Administration' => [
                    'icon' => 'view'
                ],
                'Leads' => [
                    'icon' => 'view'
                ],
            ],
            'help' => [
                'Administration' => [
                    'icon' => 'view'
                ],
                'Accounts' => [
                    'icon' => 'view'
                ],
                'Opportunities' => [
                    'icon' => 'view'
                ],
                'Cases' => [
                    'icon' => 'view'
                ],
                'Notes' => [
                    'icon' => 'view'
                ],
                'Calls' => [
                    'icon' => 'view'
                ],
                'Emails' => [
                    'icon' => 'view'
                ],
                'Meetings' => [
                    'icon' => 'view'
                ],
                'Tasks' => [
                    'icon' => 'view'
                ],
            ],
            'project' => [
                'Resource_Chart' => [
                    'icon' => 'piechart'
                ],
                'View_Project_Tasks' => [
                    'icon' => 'view'
                ],
            ],
            'project-task' => [
                'View_Project_Tasks' => [
                    'icon' => 'view'
                ],
            ],
            'roles' => [
                'Role_Management' => [
                    'icon' => 'view'
                ],
            ],
            'users' => [
                'Create_Group_User' => [
                    'icon' => 'plus'
                ],
                'Create_Security_Group' => [
                    'icon' => 'plus'
                ],
                'Security_Groups' => [
                    'icon' => 'view'
                ],
                'Role_Management' => [
                    'icon' => 'view'
                ],
                'Security_Suite_Settings' => [
                    'icon' => 'view'
                ],
            ],
        ];
        $moduleNameMapper = new ModuleNameMapper($legacyModuleNameMap);
        $routeConverter = new RouteConverter($moduleNameMapper, $legacyActionNameMap);


        $projectDir = codecept_root_dir();
        $legacyDir = $projectDir . '/legacy';
        $legacySessionName = 'LEGACYSESSID';
        $defaultSessionName = 'PHPSESSID';
        $this->navbarHandler = new NavbarHandler($projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $menuItemMap,
            $moduleNameMapper,
            $routeConverter
        );
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
                'name' => 'training',
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
            'home',
            'accounts',
            'contacts',
            'opportunities',
            'leads',
            'quotes',
            'calendar',
            'documents',
            'emails',
            'spots',
            'campaigns',
            'calls',
            'meetings',
            'tasks',
            'notes',
            'invoices',
            'contracts',
            'cases',
            'prospects',
            'prospect-lists',
            'project',
            'project-templates',
            'events',
            'event-locations',
            'products',
            'product-categories',
            'pdf-templates',
            'maps',
            'markers',
            'areas',
            'address-cache',
            'reports',
            'workflow',
            'knowledge-base',
            'knowledge-base-categories',
            'email-templates',
            'surveys'
        ];

        $this->assertSame(
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
                    'accounts',
                    'contacts',
                    'home',
                    'leads',
                    'opportunities'
                ]
            ],
            1 => [
                'name' => 'LBL_TABGROUP_MARKETING',
                'labelKey' => 'LBL_TABGROUP_MARKETING',
                // Ordered array
                'modules' => [
                    'accounts',
                    'campaigns',
                    'contacts',
                    'home',
                    'leads',
                    'prospect-lists',
                    'prospects'
                ]
            ],
            2 => [
                'name' => 'LBL_TABGROUP_SUPPORT',
                'labelKey' => 'LBL_TABGROUP_SUPPORT',
                // Ordered array
                'modules' => [
                    'accounts',
                    'bugs',
                    'cases',
                    'contacts',
                    'home'
                ]
            ],
            3 => [
                'name' => 'LBL_TABGROUP_ACTIVITIES',
                'labelKey' => 'LBL_TABGROUP_ACTIVITIES',
                // Ordered array
                'modules' => [
                    'calendar',
                    'calls',
                    'emails',
                    'home',
                    'meetings',
                    'notes',
                    'tasks'
                ]
            ],
            4 => [
                'name' => 'LBL_TABGROUP_COLLABORATION',
                'labelKey' => 'LBL_TABGROUP_COLLABORATION',
                // Ordered array
                'modules' => [
                    'documents',
                    'emails',
                    'home',
                    'project'
                ]
            ],
        ];

        $this->assertSame(
            $expected,
            $this->navbar->groupedTabs
        );
    }

    public function testGetModule(): void
    {
        $expected = [
            "home" => [
                "path" => "home",
                "defaultRoute" => "./#/home/index",
                "name" => "home",
                "labelKey" => "Home",
                "menu" => []
            ],
            "accounts" => [
                "path" => "accounts",
                "defaultRoute" => "./#/accounts/index",
                "name" => "accounts",
                "labelKey" => "Accounts",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_ACCOUNT",
                        "url" => "./#/accounts/edit",
                        "params" => [
                            "return_module" => "Accounts",
                            "return_action" => "index"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_ACCOUNT_LIST",
                        "url" => "./#/accounts/index",
                        "params" => [
                            "return_module" => "Accounts",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LNK_IMPORT_ACCOUNTS",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "Accounts",
                            "return_module" => "Accounts",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ]
                ]
            ],
            "contacts" => [
                "path" => "contacts",
                "defaultRoute" => "./#/contacts/index",
                "name" => "contacts",
                "labelKey" => "Contacts",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_CONTACT",
                        "url" => "./#/contacts/edit",
                        "params" => [
                            "return_module" => "Contacts",
                            "return_action" => "index"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "Create_Contact_Vcard",
                        "labelKey" => "LNK_IMPORT_VCARD",
                        "url" => "./#/contacts/importvcard",
                        "params" => [],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_CONTACT_LIST",
                        "url" => "./#/contacts/index",
                        "params" => [
                            "return_module" => "Contacts",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LNK_IMPORT_CONTACTS",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "Contacts",
                            "return_module" => "Contacts",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ]
                ]
            ],
            "opportunities" => [
                "path" => "opportunities",
                "defaultRoute" => "./#/opportunities/index",
                "name" => "opportunities",
                "labelKey" => "Opportunities",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_OPPORTUNITY",
                        "url" => "./#/opportunities/edit",
                        "params" => [
                            "return_module" => "Opportunities",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_OPPORTUNITY_LIST",
                        "url" => "./#/opportunities/index",
                        "params" => [
                            "return_module" => "Opportunities",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LNK_IMPORT_OPPORTUNITIES",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "Opportunities",
                            "return_module" => "Opportunities",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ]
                ]
            ],
            "leads" => [
                "path" => "leads",
                "defaultRoute" => "./#/leads/index",
                "name" => "leads",
                "labelKey" => "Leads",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_LEAD",
                        "url" => "./#/leads/edit",
                        "params" => [
                            "return_module" => "Leads",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "Create_Lead_Vcard",
                        "labelKey" => "LNK_IMPORT_VCARD",
                        "url" => "./#/leads/importvcard",
                        "params" => [],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_LEAD_LIST",
                        "url" => "./#/leads/index",
                        "params" => [
                            "return_module" => "Leads",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LNK_IMPORT_LEADS",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "Leads",
                            "return_module" => "Leads",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ]
                ]
            ],
            "quotes" => [
                "path" => "quotes",
                "defaultRoute" => "./#/quotes/index",
                "name" => "quotes",
                "labelKey" => "AOS_Quotes",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_RECORD",
                        "url" => "./#/quotes/edit",
                        "params" => [
                            "return_module" => "AOS_Quotes",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_LIST",
                        "url" => "./#/quotes/index",
                        "params" => [
                            "return_module" => "AOS_Quotes",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LBL_IMPORT",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "AOS_Quotes",
                            "return_module" => "AOS_Quotes",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LBL_IMPORT_LINE_ITEMS",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "AOS_Products_Quotes",
                            "return_module" => "AOS_Quotes",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ]
                ]
            ],
            "calendar" => [
                "path" => "calendar",
                "defaultRoute" => "./#/calendar/index",
                "name" => "calendar",
                "labelKey" => "Calendar",
                "menu" => [
                    [
                        "name" => "Schedule_Meeting",
                        "labelKey" => "LNK_NEW_MEETING",
                        "url" => "./#/meetings/edit",
                        "params" => [
                            "return_module" => "Meetings",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "Schedule_Call",
                        "labelKey" => "LNK_NEW_CALL",
                        "url" => "./#/calls/edit",
                        "params" => [
                            "return_module" => "Calls",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_TASK",
                        "url" => "./#/tasks/edit",
                        "params" => [
                            "return_module" => "Tasks",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "Today",
                        "labelKey" => "LNK_VIEW_CALENDAR",
                        "url" => "./#/calendar/index",
                        "params" => [
                            "view" => "day"
                        ],
                        "icon" => "calendar"
                    ]
                ]
            ],
            "documents" => [
                "path" => "documents",
                "defaultRoute" => "./#/documents/index",
                "name" => "documents",
                "labelKey" => "Documents",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_DOCUMENT",
                        "url" => "./#/documents/edit",
                        "params" => [
                            "return_module" => "Documents",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_DOCUMENT_LIST",
                        "url" => "./#/documents/index",
                        "params" => [],
                        "icon" => "view"
                    ]
                ]
            ],
            "emails" => [
                "path" => "emails",
                "defaultRoute" => "./#/emails/index",
                "name" => "emails",
                "labelKey" => "Emails",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_SEND_EMAIL",
                        "url" => "./#/emails/compose",
                        "params" => [
                            "return_module" => "Emails",
                            "return_action" => "index"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_VIEW_MY_INBOX",
                        "url" => "./#/emails/index",
                        "params" => [
                            "return_module" => "Emails",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ]
                ]
            ],
            "spots" => [
                "path" => "spots",
                "defaultRoute" => "./#/spots/index",
                "name" => "spots",
                "labelKey" => "Spots",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_SPOT_CREATE",
                        "url" => "./#/spots/edit",
                        "params" => [],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_SPOT_LIST",
                        "url" => "./#/spots/index",
                        "params" => [],
                        "icon" => "view"
                    ]
                ]
            ],
            "campaigns" => [
                "path" => "campaigns",
                "defaultRoute" => "./#/campaigns/index",
                "name" => "campaigns",
                "labelKey" => "Campaigns",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNL_NEW_CAMPAIGN_WIZARD",
                        "url" => "./#/campaigns/wizard-home",
                        "params" => [
                            "return_module" => "Campaigns",
                            "return_action" => "index"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_CAMPAIGN_LIST",
                        "url" => "./#/campaigns/index",
                        "params" => [
                            "return_module" => "Campaigns",
                            "return_action" => "index"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "View_Create_Email_Templates",
                        "labelKey" => "LNK_NEW_EMAIL_TEMPLATE",
                        "url" => "./#/email-templates/edit",
                        "params" => [
                            "return_module" => "EmailTemplates",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "View_Email_Templates",
                        "labelKey" => "LNK_EMAIL_TEMPLATE_LIST",
                        "url" => "./#/email-templates/index",
                        "params" => [],
                        "icon" => "view"
                    ],
                    [
                        "name" => "View_Diagnostics",
                        "labelKey" => "LBL_DIAGNOSTIC_WIZARD",
                        "url" => "./#/campaigns/diagnostic",
                        "params" => [
                            "return_module" => "Campaigns",
                            "return_action" => "index"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Create_Person_Form",
                        "labelKey" => "LBL_WEB_TO_LEAD",
                        "url" => "./#/campaigns/web-to-lead",
                        "params" => [
                            "return_module" => "Campaigns",
                            "return_action" => "index"
                        ],
                        "icon" => "person"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LNK_IMPORT_CAMPAIGNS",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "Campaigns",
                            "return_module" => "Campaigns",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ]
                ]
            ],
            "calls" => [
                "path" => "calls",
                "defaultRoute" => "./#/calls/index",
                "name" => "calls",
                "labelKey" => "Calls",
                "menu" => [
                    [
                        "name" => "Schedule_Call",
                        "labelKey" => "LNK_NEW_CALL",
                        "url" => "./#/calls/edit",
                        "params" => [
                            "return_module" => "Calls",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_CALL_LIST",
                        "url" => "./#/calls/index",
                        "params" => [
                            "return_module" => "Calls",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LNK_IMPORT_CALLS",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "Calls",
                            "return_module" => "Calls",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ]
                ]
            ],
            "meetings" => [
                "path" => "meetings",
                "defaultRoute" => "./#/meetings/index",
                "name" => "meetings",
                "labelKey" => "Meetings",
                "menu" => [
                    [
                        "name" => "Schedule_Meeting",
                        "labelKey" => "LNK_NEW_MEETING",
                        "url" => "./#/meetings/edit",
                        "params" => [
                            "return_module" => "Meetings",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_MEETING_LIST",
                        "url" => "./#/meetings/index",
                        "params" => [
                            "return_module" => "Meetings",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LNK_IMPORT_MEETINGS",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "Meetings",
                            "return_module" => "Meetings",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ]
                ]
            ],
            "tasks" => [
                "path" => "tasks",
                "defaultRoute" => "./#/tasks/index",
                "name" => "tasks",
                "labelKey" => "Tasks",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_TASK",
                        "url" => "./#/tasks/edit",
                        "params" => [
                            "return_module" => "Tasks",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_TASK_LIST",
                        "url" => "./#/tasks/index",
                        "params" => [
                            "return_module" => "Tasks",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LNK_IMPORT_TASKS",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "Tasks",
                            "return_module" => "Tasks",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ]
                ]
            ],
            "notes" => [
                "path" => "notes",
                "defaultRoute" => "./#/notes/index",
                "name" => "notes",
                "labelKey" => "Notes",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_NOTE",
                        "url" => "./#/notes/edit",
                        "params" => [
                            "return_module" => "Notes",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_NOTE_LIST",
                        "url" => "./#/notes/index",
                        "params" => [
                            "return_module" => "Notes",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LNK_IMPORT_NOTES",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "Notes",
                            "return_module" => "Notes",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ]
                ]
            ],
            "invoices" => [
                "path" => "invoices",
                "defaultRoute" => "./#/invoices/index",
                "name" => "invoices",
                "labelKey" => "AOS_Invoices",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_RECORD",
                        "url" => "./#/invoices/edit",
                        "params" => [
                            "return_module" => "AOS_Invoices",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_LIST",
                        "url" => "./#/invoices/index",
                        "params" => [
                            "return_module" => "AOS_Invoices",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LBL_IMPORT",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "AOS_Invoices",
                            "return_module" => "AOS_Invoices",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LBL_IMPORT_LINE_ITEMS",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "AOS_Products_Quotes",
                            "return_module" => "AOS_Invoices",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ]
                ]
            ],
            "contracts" => [
                "path" => "contracts",
                "defaultRoute" => "./#/contracts/index",
                "name" => "contracts",
                "labelKey" => "AOS_Contracts",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_RECORD",
                        "url" => "./#/contracts/edit",
                        "params" => [
                            "return_module" => "AOS_Contracts",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_LIST",
                        "url" => "./#/contracts/index",
                        "params" => [
                            "return_module" => "AOS_Contracts",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LBL_IMPORT",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "AOS_Contracts",
                            "return_module" => "AOS_Contracts",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ]
                ]
            ],
            "cases" => [
                "path" => "cases",
                "defaultRoute" => "./#/cases/index",
                "name" => "cases",
                "labelKey" => "Cases",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_CASE",
                        "url" => "./#/cases/edit",
                        "params" => [
                            "return_module" => "Cases",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_CASE_LIST",
                        "url" => "./#/cases/index",
                        "params" => [
                            "return_module" => "Cases",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LNK_IMPORT_CASES",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "Cases",
                            "return_module" => "Cases",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ]
                ]
            ],
            "prospects" => [
                "path" => "prospects",
                "defaultRoute" => "./#/prospects/index",
                "name" => "prospects",
                "labelKey" => "Prospects",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_PROSPECT",
                        "url" => "./#/prospects/edit",
                        "params" => [
                            "return_module" => "Prospects",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_PROSPECT_LIST",
                        "url" => "./#/prospects/index",
                        "params" => [
                            "return_module" => "Prospects",
                            "return_action" => "index"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LNK_IMPORT_PROSPECTS",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "Prospects",
                            "return_module" => "Prospects",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ]
                ]
            ],
            "prospect-lists" => [
                "path" => "prospect-lists",
                "defaultRoute" => "./#/prospect-lists/index",
                "name" => "prospect-lists",
                "labelKey" => "ProspectLists",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_PROSPECT_LIST",
                        "url" => "./#/prospect-lists/edit",
                        "params" => [
                            "return_module" => "ProspectLists",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_PROSPECT_LIST_LIST",
                        "url" => "./#/prospect-lists/index",
                        "params" => [
                            "return_module" => "ProspectLists",
                            "return_action" => "index"
                        ],
                        "icon" => "view"
                    ]
                ]
            ],
            "project" => [
                "path" => "project",
                "defaultRoute" => "./#/project/index",
                "name" => "project",
                "labelKey" => "Project",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_PROJECT",
                        "url" => "./#/project/edit",
                        "params" => [
                            "return_module" => "Project",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_PROJECT_LIST",
                        "url" => "./#/project/index",
                        "params" => [],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Resource_Chart",
                        "labelKey" => "LBL_RESOURCE_CHART",
                        "url" => "./#/project/resource-list",
                        "params" => [],
                        "icon" => "piechart"
                    ],
                    [
                        "name" => "View_Project_Tasks",
                        "labelKey" => "LNK_PROJECT_TASK_LIST",
                        "url" => "./#/project-task/index",
                        "params" => [],
                        "icon" => "view"
                    ]
                ]
            ],
            "project-templates" => [
                "path" => "project-templates",
                "defaultRoute" => "./#/project-templates/index",
                "name" => "project-templates",
                "labelKey" => "AM_ProjectTemplates",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_RECORD",
                        "url" => "./#/project-templates/edit",
                        "params" => [
                            "return_module" => "AM_ProjectTemplates",
                            "return_action" => "index"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_LIST",
                        "url" => "./#/project-templates/index",
                        "params" => [
                            "return_module" => "AM_ProjectTemplates",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LNK_IMPORT_AM_PROJECTTEMPLATES",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "AM_ProjectTemplates",
                            "return_module" => "AM_ProjectTemplates",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ]
                ]
            ],
            "events" => [
                "path" => "events",
                "defaultRoute" => "./#/events/index",
                "name" => "events",
                "labelKey" => "FP_events",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_RECORD",
                        "url" => "./#/events/edit",
                        "params" => [
                            "return_module" => "FP_events",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_LIST",
                        "url" => "./#/events/index",
                        "params" => [
                            "return_module" => "FP_events",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LBL_IMPORT",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "FP_events",
                            "return_module" => "FP_events",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ]
                ]
            ],
            "event-locations" => [
                "path" => "event-locations",
                "defaultRoute" => "./#/event-locations/index",
                "name" => "event-locations",
                "labelKey" => "FP_Event_Locations",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_RECORD",
                        "url" => "./#/event-locations/edit",
                        "params" => [
                            "return_module" => "FP_Event_Locations",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_LIST",
                        "url" => "./#/event-locations/index",
                        "params" => [],
                        "icon" => "view"
                    ]
                ]
            ],
            "products" => [
                "path" => "products",
                "defaultRoute" => "./#/products/index",
                "name" => "products",
                "labelKey" => "AOS_Products",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_RECORD",
                        "url" => "./#/products/edit",
                        "params" => [
                            "return_module" => "AOS_Products",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_LIST",
                        "url" => "./#/products/index",
                        "params" => [
                            "return_module" => "AOS_Products",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LBL_IMPORT",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "AOS_Products",
                            "return_module" => "AOS_Products",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ]
                ]
            ],
            "product-categories" => [
                "path" => "product-categories",
                "defaultRoute" => "./#/product-categories/index",
                "name" => "product-categories",
                "labelKey" => "AOS_Product_Categories",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_RECORD",
                        "url" => "./#/product-categories/edit",
                        "params" => [
                            "return_module" => "AOS_Product_Categories",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_LIST",
                        "url" => "./#/product-categories/index",
                        "params" => [
                            "return_module" => "AOS_Product_Categories",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LBL_IMPORT",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "AOS_Product_Categories",
                            "return_module" => "AOS_Product_Categories",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ]
                ]
            ],
            "pdf-templates" => [
                "path" => "pdf-templates",
                "defaultRoute" => "./#/pdf-templates/index",
                "name" => "pdf-templates",
                "labelKey" => "AOS_PDF_Templates",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_RECORD",
                        "url" => "./#/pdf-templates/edit",
                        "params" => [
                            "return_module" => "AOS_PDF_Templates",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_LIST",
                        "url" => "./#/pdf-templates/index",
                        "params" => [
                            "return_module" => "AOS_PDF_Templates",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LBL_IMPORT",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "AOS_PDF_Templates",
                            "return_module" => "AOS_PDF_Templates",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ]
                ]
            ],
            "maps" => [
                "path" => "maps",
                "defaultRoute" => "./#/maps/index",
                "name" => "maps",
                "labelKey" => "jjwg_Maps",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_MAP",
                        "url" => "./#/maps/edit",
                        "params" => [
                            "return_module" => "jjwg_Maps",
                            "return_action" => "index"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List_Maps",
                        "labelKey" => "LNK_MAP_LIST",
                        "url" => "./#/maps/index",
                        "params" => [
                            "return_module" => "jjwg_Maps",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Quick_Radius_Map",
                        "labelKey" => "LBL_MAP_QUICK_RADIUS",
                        "url" => "./#/maps/quick-radius",
                        "params" => [
                            "return_module" => "jjwg_Maps",
                            "return_action" => "index"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LBL_IMPORT",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "jjwg_Maps",
                            "return_module" => "jjwg_Maps",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ]
                ]
            ],
            "markers" => [
                "path" => "markers",
                "defaultRoute" => "./#/markers/index",
                "name" => "markers",
                "labelKey" => "jjwg_Markers",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_RECORD",
                        "url" => "./#/markers/edit",
                        "params" => [],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_LIST",
                        "url" => "./#/markers/index",
                        "params" => [],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LNK_IMPORT_JJWG_MARKERS",
                        "url" => "./#/markers/index",
                        "params" => [],
                        "icon" => "download"
                    ]
                ]
            ],
            "areas" => [
                "path" => "areas",
                "defaultRoute" => "./#/areas/index",
                "name" => "areas",
                "labelKey" => "jjwg_Areas",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_RECORD",
                        "url" => "./#/areas/edit",
                        "params" => [
                            "return_module" => "jjwg_Areas",
                            "return_action" => "index"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_LIST",
                        "url" => "./#/areas/index",
                        "params" => [
                            "return_module" => "jjwg_Areas",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LBL_IMPORT",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "jjwg_Areas",
                            "return_module" => "jjwg_Areas",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ]
                ]
            ],
            "address-cache" => [
                "path" => "address-cache",
                "defaultRoute" => "./#/address-cache/index",
                "name" => "address-cache",
                "labelKey" => "jjwg_Address_Cache",
                "menu" => [
                    [
                        "name" => "Createjjwg_Address_Cache",
                        "labelKey" => "LNK_NEW_RECORD",
                        "url" => "./#/address-cache/edit",
                        "params" => [
                            "return_module" => "jjwg_Address_Cache",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "jjwg_Address_Cache",
                        "labelKey" => "LNK_LIST",
                        "url" => "./#/address-cache/index",
                        "params" => [
                            "return_module" => "jjwg_Address_Cache",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LBL_IMPORT",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "jjwg_Address_Cache",
                            "return_module" => "jjwg_Address_Cache",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ]
                ]
            ],
            "reports" => [
                "path" => "reports",
                "defaultRoute" => "./#/reports/index",
                "name" => "reports",
                "labelKey" => "AOR_Reports",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_RECORD",
                        "url" => "./#/reports/edit",
                        "params" => [
                            "return_module" => "AOR_Reports",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_LIST",
                        "url" => "./#/reports/index",
                        "params" => [
                            "return_module" => "AOR_Reports",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "Import",
                        "labelKey" => "LBL_IMPORT",
                        "url" => "./#/import/step1",
                        "params" => [
                            "import_module" => "AOR_Reports",
                            "return_module" => "AOR_Reports",
                            "return_action" => "index"
                        ],
                        "icon" => "download"
                    ]
                ]
            ],
            "workflow" => [
                "path" => "workflow",
                "defaultRoute" => "./#/workflow/index",
                "name" => "workflow",
                "labelKey" => "AOW_WorkFlow",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_RECORD",
                        "url" => "./#/workflow/edit",
                        "params" => [
                            "return_module" => "AOW_WorkFlow",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_LIST",
                        "url" => "./#/workflow/index",
                        "params" => [
                            "return_module" => "AOW_WorkFlow",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ],
                    [
                        "name" => "View_Process_Audit",
                        "labelKey" => "LNK_PROCESSED_LIST",
                        "url" => "./#/workflow-processed/index",
                        "params" => [
                            "return_module" => "AOW_Processed",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ]
                ]
            ],
            "knowledge-base" => [
                "path" => "knowledge-base",
                "defaultRoute" => "./#/knowledge-base/index",
                "name" => "knowledge-base",
                "labelKey" => "AOK_KnowledgeBase",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_RECORD",
                        "url" => "./#/knowledge-base/edit",
                        "params" => [],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_LIST",
                        "url" => "./#/knowledge-base/index",
                        "params" => [],
                        "icon" => "view"
                    ]
                ]
            ],
            "knowledge-base-categories" => [
                "path" => "knowledge-base-categories",
                "defaultRoute" => "./#/knowledge-base-categories/index",
                "name" => "knowledge-base-categories",
                "labelKey" => "AOK_Knowledge_Base_Categories",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_RECORD",
                        "url" => "./#/knowledge-base-categories/edit",
                        "params" => [],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_LIST",
                        "url" => "./#/knowledge-base-categories/index",
                        "params" => [],
                        "icon" => "view"
                    ]
                ]
            ],
            "email-templates" => [
                "path" => "email-templates",
                "defaultRoute" => "./#/email-templates/index",
                "name" => "email-templates",
                "labelKey" => "EmailTemplates",
                "menu" => [
                    [
                        "name" => "Create",
                        "labelKey" => "LNK_NEW_EMAIL_TEMPLATE",
                        "url" => "./#/email-templates/edit",
                        "params" => [
                            "return_module" => "EmailTemplates",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "View_Email_Templates",
                        "labelKey" => "LNK_EMAIL_TEMPLATE_LIST",
                        "url" => "./#/email-templates/index",
                        "params" => [],
                        "icon" => "view"
                    ]
                ]
            ],
            "surveys" => [
                "path" => "surveys",
                "defaultRoute" => "./#/surveys/index",
                "name" => "surveys",
                "labelKey" => "Surveys",
                "menu" => [
                    [
                        "name" => "Add",
                        "labelKey" => "LNK_NEW_RECORD",
                        "url" => "./#/surveys/edit",
                        "params" => [
                            "return_module" => "Surveys",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "plus"
                    ],
                    [
                        "name" => "List",
                        "labelKey" => "LNK_LIST",
                        "url" => "./#/surveys/index",
                        "params" => [
                            "return_module" => "Surveys",
                            "return_action" => "DetailView"
                        ],
                        "icon" => "view"
                    ]
                ]
            ]
        ];


        $this->assertSame(
            $expected,
            $this->navbar->modules
        );
    }
}
