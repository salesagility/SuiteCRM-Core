<?php

namespace App\Legacy\Statistics\Series;

use App\Entity\Statistic;
use App\Legacy\Data\PresetDataHandlers\SubpanelDataQueryHandler;
use App\Legacy\Statistics\StatisticsHandlingTrait;
use App\Model\Statistics\ChartOptions;
use App\Service\StatisticsProviderInterface;
use DateInterval;
use DateTime;
use Exception;

class PastYearsClosedOpportunityAmounts extends SubpanelDataQueryHandler implements StatisticsProviderInterface
{
    use StatisticsHandlingTrait;

    public const KEY = 'accounts-past-years-closed-opportunity-amounts';

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
        $subpanel = 'opportunities';

        if (empty($module) || empty($id)) {
            return $this->getEmptyResponse(self::KEY);
        }

        $this->init();
        $this->startLegacyApp();

        $queries = $this->getQueries($module, $id, $subpanel);

        $years = 5;

        try {
            $yearsList = $this->getPastYearsList($years);
            $nextYear = $this->getNextYear();
        } catch (Exception $exception) {
            return $this->getEmptyResponse(self::KEY);
        }

        $startYear = $yearsList[0];
        $startYearDateString = $startYear . '-01-01';
        $endYear = $yearsList[$years - 1];
        $endYearDateString = $nextYear . '-01-01';

        $statusesList = ['Closed Won', 'Closed Lost'];
        $statuses = implode("' , '", $statusesList);

        $parts = $queries[0];
        $parts['select'] = 'SELECT SUM(opportunities.amount) as amount_by_year, EXTRACT(YEAR FROM opportunities.date_closed) as year, opportunities.sales_stage as sales_stage ';
        $parts['where'] .= ' AND opportunities.date_closed is not null ';
        $parts['where'] .= ' AND opportunities.amount is not null ';
        $parts['where'] .= ' AND opportunities.sales_stage is not null ';
        $parts['where'] .= " AND opportunities.date_closed >= '$startYearDateString'";
        $parts['where'] .= " AND opportunities.date_closed < '$endYearDateString'";
        $parts['where'] .= " AND opportunities.sales_stage IN ('$statuses') ";
        $parts['group_by'] = ' GROUP BY EXTRACT(YEAR FROM opportunities.date_closed), opportunities.sales_stage ';
        $parts['order_by'] = ' ORDER BY opportunities.sales_stage ';

        $innerQuery = $this->joinQueryParts($parts);

        $result = $this->fetchAll($innerQuery);

        $groupingField = 'sales_stage';
        $nameField = 'year';
        $valueField = 'amount_by_year';


        $series = $this->buildMultiSeries($result, $groupingField, $nameField, $valueField, $yearsList);


        $chartOptions = new ChartOptions();
        $chartOptions->legend = false;
        $chartOptions->yAxisTickFormatting = true;
        $chartOptions->xAxisTicks = $yearsList;
        $chartOptions->xScaleMin = $startYear;
        $chartOptions->xScaleMax = $endYear;

        $statistic = $this->buildSeriesResponse(self::KEY, 'currency', $series, $chartOptions);

        $this->close();

        return $statistic;
    }

    /**
     * @return int
     * @throws Exception
     */
    protected function getNextYear(): string
    {
        $now = new DateTime();
        $now->ADD(new DateInterval('P1Y'));

        return $now->format('Y');
    }

    /**
     * @param int $years
     * @return string[]
     * @throws Exception
     */
    protected function getPastYearsList(int $years): array
    {
        $yearsList = [];
        for ($i = 0; $i < $years; $i++) {
            $now = new DateTime();
            $now->sub(new DateInterval('P' . $i . 'Y'));
            array_unshift($yearsList, $now->format('Y'));
        }

        return $yearsList;
    }
}
