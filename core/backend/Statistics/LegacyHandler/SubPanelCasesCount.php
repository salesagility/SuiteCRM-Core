<?php

namespace App\Statistics\LegacyHandler;

use App\Entity\Statistic;
use App\Data\LegacyHandler\PresetDataHandlers\SubpanelDataQueryHandler;
use App\Service\StatisticsProviderInterface;

class SubPanelCasesCount extends SubpanelDataQueryHandler implements StatisticsProviderInterface
{
    use StatisticsHandlingTrait;

    public const KEY = 'cases';

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
        $subpanel = 'cases';
        [$module, $id] = $this->extractContext($query);
        if (empty($module) || empty($id)) {
            return $this->getEmptyResponse(self::KEY);
        }

        $this->init();
        $this->startLegacyApp();

        $queries = $this->getQueries($module, $id, $subpanel);
        $parts = $queries[0];
        $parts['select'] = 'SELECT COUNT(*) as value';
        $parts['where'] .= " AND cases.`state` = 'Open' ";

        $dbQuery = $this->joinQueryParts($parts);
        $result = $this->fetchRow($dbQuery);
        $statistic = $this->buildSingleValueResponse(self::KEY, 'int', $result);
        $this->addMetadata($statistic, ['tooltip_title_key' => 'LBL_OPEN_CASES_COUNT_TOOLTIP']);
        $this->addMetadata($statistic, ['descriptionKey' => 'LBL_OPEN_CASES_COUNT']);
        $this->close();

        return $statistic;
    }
}
