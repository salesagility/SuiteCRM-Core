<?php

namespace App\Statistics\LegacyHandler;

use App\Statistics\Entity\Statistic;
use App\Data\LegacyHandler\PresetDataHandlers\SubpanelDataQueryHandler;
use App\Service\StatisticsProviderInterface;

class SubPanelInvoicesTotal extends SubpanelDataQueryHandler implements StatisticsProviderInterface
{
    use StatisticsHandlingTrait;

    public const KEY = 'invoices';

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
        [$module, $id] = $this->extractContext($query);
        if (empty($module) || empty($id)) {
            return $this->getEmptyResponse(self::KEY);
        }
        $subpanel = $query['key'];
        $subpanelName = $query['params']['subpanel'] ?? '';
        if (!empty($subpanelName)) {
            $subpanel = $subpanelName;
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
            $this->addMetadata($statistic, ['tooltip_title_key' => 'LBL_INVOICES_OVERDUE_TOOLTIP']);
            $this->addMetadata($statistic, ['descriptionKey' => 'LBL_INVOICES_OVERDUE']);

            return $statistic;
        }

        $statistic = $this->buildSingleValueResponse(self::KEY, 'int', $result);
        $this->addMetadata($statistic, ['tooltip_title_key' => 'LBL_INVOICES_OVERDUE_TOOLTIP']);
        $this->addMetadata($statistic, ['descriptionKey' => 'LBL_INVOICES_OVERDUE']);
        $this->close();

        return $statistic;
    }
}
