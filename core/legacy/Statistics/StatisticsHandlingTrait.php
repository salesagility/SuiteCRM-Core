<?php

namespace App\Legacy\Statistics;

use App\Entity\Statistic;
use App\Model\Statistics\ChartOptions;
use App\Model\Statistics\Series;
use App\Model\Statistics\SeriesItem;
use App\Model\Statistics\SeriesResult;

trait StatisticsHandlingTrait
{

    /**
     * Build empty response statistic
     * @param string $key
     * @return Statistic
     */
    protected function getEmptyResponse(string $key): Statistic
    {
        $statistic = new Statistic();
        $statistic->setId($key);
        $statistic->setData(['value' => '-']);
        $statistic->setMetadata([
            'type' => 'single-value-statistic',
            'dataType' => 'varchar',
        ]);

        return $statistic;
    }

    /**
     * @param string $key
     * @param string $dataType
     * @param array $result
     * @return Statistic
     */
    protected function buildSingleValueResponse(string $key, string $dataType, array $result): Statistic
    {
        $statistic = new Statistic();
        $statistic->setId($key);
        $statistic->setData($result);
        $statistic->setMetadata([
            'type' => 'single-value-statistic',
            'dataType' => $dataType,
        ]);

        return $statistic;
    }

    /**
     * @param string $key
     * @param string $dataType
     * @param SeriesResult $result
     * @param ChartOptions $options
     * @return Statistic
     */
    protected function buildSeriesResponse(
        string $key,
        string $dataType,
        SeriesResult $result,
        ChartOptions $options = null
    ): Statistic {
        $statistic = new Statistic();
        $statistic->setId($key);
        $statistic->setData($this->toSeriesArray($result));
        $metadata = [
            'type' => 'series-statistic',
            'dataType' => $dataType,
        ];

        if ($options !== null) {
            $metadata['chartOptions'] = (array)$options;
        }

        $statistic->setMetadata($metadata);

        return $statistic;
    }

    /**
     * @param array $result
     * @param string $groupingField
     * @param string $nameField
     * @param string $valueField
     * @param $defaultValues
     * @return Series|SeriesResult
     */
    protected function buildMultiSeries(
        array $result,
        string $groupingField,
        string $nameField,
        string $valueField,
        array $defaultValues
    ) {
        $seriesMap = [];

        foreach ($result as $row) {
            $groupingFieldValue = $row[$groupingField] ?? '';
            $nameFieldValue = $row[$nameField] ?? '';
            $valueFieldValue = $row[$valueField] ?? '';

            if (empty($seriesMap[$groupingFieldValue])) {
                $series = new Series();
                $series->name = $groupingFieldValue;
                $series->series = [];
                $seriesMap[$groupingFieldValue] = [
                    'series' => $series,
                    'items' => []
                ];

                foreach ($defaultValues as $default) {
                    $item = new SeriesItem();
                    $item->name = $default;
                    $item->value = '0';

                    $seriesMap[$groupingFieldValue]['items'][$default] = $item;
                }
            }

            $seriesMap[$groupingFieldValue]['items'][$nameFieldValue]->value = $valueFieldValue;
        }

        $series = new SeriesResult();
        $series->multiSeries = [];

        foreach ($seriesMap as $item) {
            $item['series']->series = array_values($item['items']);
            $series->multiSeries[] = $item['series'];
        }

        return $series;
    }


    /**
     * @param SeriesResult $result
     * @return array
     */
    protected function toSeriesArray(SeriesResult $result): array
    {
        $seriesArray = [];
        if (isset($result->singleSeries)) {
            $seriesArray['singleSeries'] = [];
            foreach ($result->singleSeries as $singleSeriesEntry) {
                $seriesArray['singleSeries'][] = $this->buildSeriesEntry($singleSeriesEntry);
            }
        }

        if (isset($result->multiSeries)) {
            $seriesArray['multiSeries'] = [];
            foreach ($result->multiSeries as $multiSeriesEntry) {
                $multiSeriesArray = [];
                $multiSeriesArray['name'] = $multiSeriesEntry->name;
                $multiSeriesArray['series'] = [];

                foreach ($multiSeriesEntry->series as $singleSeriesEntry) {

                    $multiSeriesArray['series'][] = $this->buildSeriesEntry($singleSeriesEntry);


                }
                $seriesArray['multiSeries'][] = $multiSeriesArray;
            }
        }

        return $seriesArray;
    }

    /**
     * @param Statistic $statistic
     * @param array $newMeta
     */
    protected function addMetadata(Statistic $statistic, array $newMeta): void
    {
        $metadata = $statistic->getMetadata() ?? [];
        $metadata = array_merge($metadata, $newMeta);
        $statistic->setMetadata($metadata);
    }

    /**
     * Build currency statistic result
     * @param array $result
     * @return Statistic
     */
    protected function buildCurrencyResult(array $result): Statistic
    {
        return $this->buildNumberResult($result, 'currency');
    }

    /**
     * Build number statistic result
     * @param array $result
     * @param string $type
     * @return Statistic
     */
    protected function buildNumberResult(array $result, string $type): Statistic
    {
        $value = $result['value'] ?? 0;

        if (empty($value)) {
            $result = ['value' => 0];
        }

        $statistic = new Statistic();
        $statistic->setId(self::KEY);
        $statistic->setData($result);
        $statistic->setMetadata([
            'type' => 'single-value-statistic',
            'dataType' => $type,
        ]);

        return $statistic;
    }

    /**
     * @param array $parts
     * @return string
     */
    protected function joinQueryParts(array $parts): string
    {
        $queryParts = [];
        $queryParts[] = $parts['select'] ?? '';
        $queryParts[] = $parts['from'] ?? '';
        $queryParts[] = $parts['where'] ?? '';
        $queryParts[] = $parts['group_by'] ?? '';
        $queryParts[] = $parts['order_by'] ?? '';

        return implode(' ', $queryParts);
    }

    /**
     * @param array $query
     * @return array
     */
    protected function extractContext(array $query): array
    {
        $module = $query['context']['module'] ?? '';
        $id = $query['context']['id'] ?? '';

        return array($module, $id);
    }

    /**
     * @param SeriesItem $singleSeriesEntry
     * @return array
     */
    protected function buildSeriesEntry(SeriesItem $singleSeriesEntry): array
    {
        $keys = ['name', 'value', 'extra', 'min', 'max', 'label'];

        $entry = [];

        foreach ($keys as $key) {
            if ($singleSeriesEntry->$key !== null) {
                $entry[$key] = $singleSeriesEntry->$key;
            }
        }

        return $entry;
    }

}
