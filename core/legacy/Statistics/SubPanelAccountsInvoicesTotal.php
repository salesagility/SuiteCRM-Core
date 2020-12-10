<?php

namespace App\Legacy\Statistics;

use App\Entity\Statistic;
use App\Legacy\Data\PresetDataHandlers\SubpanelDataQueryHandler;
use App\Service\StatisticsProviderInterface;

class SubPanelAccountsInvoicesTotal extends SubpanelDataQueryHandler implements StatisticsProviderInterface
{
    use StatisticsHandlingTrait;

    public const KEY = 'accounts-invoices';

    /**
     * @inheritDoc
     */
    public function getKey(): string
    {
        return self::KEY;
    }

    /**
     * @inheritDoc
     */
    public function getData(array $query): Statistic
    {
        $subpanel = 'account_aos_invoices';
        [$module, $id] = $this->extractContext($query);
        if (empty($module) || empty($id)) {
            return $this->getEmptyResponse(self::KEY);
        }

        $this->init();
        $this->startLegacyApp();

        $dateNow = date("Y-m-d");

        $queries = $this->getQueries($module, $id, $subpanel);
        $parts = $queries[0];
        $parts['select'] = 'SELECT COUNT(*) as value';
        $parts['where'] .= " AND aos_invoices.`status` = 'Unpaid' AND aos_invoices.`due_date` <= '$dateNow'";

        $dbQuery = $this->joinQueryParts($parts);
        $result = $this->fetchRow($dbQuery);

        if (empty($result)) {
            $statistic = $this->getEmptyResponse(self::KEY);
            $this->close();

            return $statistic;
        }

        $statistic = $this->buildSingleValueResponse(self::KEY, 'int', $result);

        $this->close();

        return $statistic;
    }
}
