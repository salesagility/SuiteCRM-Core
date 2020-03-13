<?php

namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\AppListStrings;

/**
 * Class AppListStringsItemDataProvider
 */
final class AppListStringsItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{

    /**
     * Defined supported resources
     * @param string $resourceClass
     * @param string|null $operationName
     * @param array $context
     * @return bool
     */
    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return AppListStrings::class === $resourceClass;
    }

    /**
     * Get app list strings for given language id
     * @param string $resourceClass
     * @param array|int|string $id
     * @param string|null $operationName
     * @param array $context
     * @return AppListStrings|null
     */
    public function getItem(
        string $resourceClass,
        $id,
        string $operationName = null,
        array $context = []
    ): ?AppListStrings {

        $appListStrings = new AppListStrings();
        $appListStrings->setId('en_us');
        $appListStrings->setItems([
            'moduleList' => [
                'Home' => 'Home',
                'ResourceCalendar' => 'Resource Calendar',
                'Contacts' => 'Contacts',
                'Accounts' => 'Accounts',
                'Alerts' => 'Alerts',
                'Opportunities' => 'Opportunities',
                'Cases' => 'Cases',
                'Notes' => 'Notes',
                'Calls' => 'Calls',
                'TemplateSectionLine' => 'Template Section Line',
                'Calls_Reschedule' => 'Calls Reschedule',
                'Emails' => 'Emails',
                'EAPM' => 'EAPM',
                'Meetings' => 'Meetings',
                'Tasks' => 'Tasks'
            ],
            'account_type_dom' => [
                '' => '',
                'Analyst' => 'Analyst',
                'Competitor' => 'Competitor',
                'Customer' => 'Customer',
                'Integrator' => 'Integrator',
                'Investor' => 'Investor',
                'Partner' => 'Partner',
                'Press' => 'Press',
                'Prospect' => 'Prospect',
                'Reseller' => 'Reseller',
                'Other' => 'Other',
            ],
        ]);

        return $appListStrings;
    }
}