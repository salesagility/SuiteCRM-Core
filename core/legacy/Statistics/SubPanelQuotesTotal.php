<?php

namespace App\Legacy\Statistics;

use App\Entity\Statistic;
use App\Legacy\Data\PresetDataHandlers\SubpanelDataQueryHandler;
use App\Service\StatisticsProviderInterface;

class SubPanelQuotesTotal extends SubpanelDataQueryHandler implements StatisticsProviderInterface
{
    use StatisticsHandlingTrait;

    public const KEY = 'quotes';

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
        $subpanel = $query['key'] ?? '';

        $subpanelName = $query['params']['subpanel'] ?? '';
        if (!empty($subpanelName)) {
            $subpanel = $subpanelName;
        }

        if (empty($module) || empty($id) || empty($subpanel)) {
            return $this->getEmptyResponse(self::KEY);
        }


        $this->init();
        $this->startLegacyApp();

        $dateNow = date("Y-m-d");
        global $app_strings;

        $queries = $this->getQueries($module, $id, $subpanel);
        $parts = $queries[0];
        $parts['select'] = 'SELECT q.`expiration`';
        $parts['from'] = ' FROM aos_quotes as q ';
        $parts['where'] = " WHERE q.`expiration` >= '$dateNow'AND q.deleted = 0  AND (q.billing_account_id = '$id' OR q.billing_contact_id = '$id') ";
        $parts['order_by'] = ' ORDER BY q.expiration ASC LIMIT 1 ';
        $innerQuery = $this->joinQueryParts($parts);
        $result = $this->fetchRow($innerQuery);

        if (empty($result)) {
            $empty = $app_strings['LBL_NONE_OUTSTANDING'];
            $statistic = $this->buildSingleValueResponse(self::KEY, 'string', ['value' => $empty]);
            $this->close();
            $this->addMetadata($statistic, ['tooltip_title_key' => 'LBL_QUOTES_EXPIRY']);
            return $statistic;
        }

        $date = $result['expiration'];
        $statistic = $this->buildSingleValueResponse(self::KEY, 'date', ['value' => $date]);
        $this->addMetadata($statistic, ['tooltip_title_key' => 'LBL_QUOTES_EXPIRY']);
        return $statistic;
    }
}
