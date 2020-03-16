<?php namespace App\Tests;

use ApiPlatform\Core\Exception\ItemNotFoundException;
use App\Entity\ModStrings;
use App\Service\ModuleNameMapper;
use Codeception\Test\Unit;
use SuiteCRM\Core\Legacy\ModStringsHandler;

class ModStringsHandlerTest extends Unit
{
    /**
     * @var UnitTester
     */
    protected $tester;

    /**
     * @var ModStringsHandler
     */
    protected $handler;

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
                'frontend' => 'workFlow',
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
        $moduleNameMapper = new ModuleNameMapper($legacyModuleNameMap);

        $projectDir = codecept_root_dir();
        $legacyDir = $projectDir . '/legacy';
        $legacySessionName = 'LEGACYSESSID';
        $defaultSessionName = 'PHPSESSID';
        $this->handler = new ModStringsHandler(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $moduleNameMapper
        );
    }

    // tests

    /**
     * Test Invalid language handling in ModStringsHandler
     */
    public function testInvalidLanguageCheck()
    {
        $this->expectException(ItemNotFoundException::class);
        $this->handler->getModStrings('invalid_lang');
    }

    /**
     * Test default language retrieval in ModStringsHandler
     */
    public function testDefaultLanguageKey()
    {
        $modStrings = $this->handler->getModStrings('en_us');
        static::assertNotNull($modStrings);
        static::assertEquals('en_us', $modStrings->getId());
        static::assertIsArray($modStrings->getItems());
        $this->assertLanguageKey('home', 'LBL_MODULE_NAME', $modStrings);
        $this->assertLanguageKey('accounts', 'LNK_ACCOUNT_LIST', $modStrings);
        $this->assertLanguageKey('accounts', 'LNK_NEW_ACCOUNT', $modStrings);
    }

    /**
     * Asserts that the given label $key exists in Mod
     * @param $module
     * @param string $key
     * @param ModStrings $modStrings
     */
    protected function assertLanguageKey($module, $key, ModStrings $modStrings)
    {
        static::assertArrayHasKey($module, $modStrings->getItems());
        static::assertNotEmpty($modStrings->getItems()[$module]);
        static::assertIsArray($modStrings->getItems()[$module]);
        static::assertArrayHasKey($key, $modStrings->getItems()[$module]);
        static::assertNotEmpty($modStrings->getItems()[$module][$key]);
    }

}