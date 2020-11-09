<?php

namespace App\Legacy\Statistics;

use aCase;
use App\Entity\Statistic;
use App\Legacy\Data\PresetDataHandlers\SubpanelDataQueryHandler;
use App\Service\StatisticsProviderInterface;
use BeanFactory;


class CasesPerAccount extends SubpanelDataQueryHandler implements StatisticsProviderInterface
{
    use StatisticsHandlingTrait;

    public const KEY = 'cases-per-account';

    /**
     * @inheritDoc
     */
    public function getKey(): string
    {
        return self::KEY;
    }

    /**
     * @inheritDoc
     * @param array $query
     * @return Statistic
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

        $module = 'accounts';
        $id = $this->getCase($id)->account_id;
        $queries = $this->getQueries($module, $id, $subpanel);
        $parts = $queries[0];
        $parts['select'] = 'SELECT COUNT(*) as value';

        $dbQuery = $this->joinQueryParts($parts);
        $result = $this->fetchRow($dbQuery);
        $statistic = $this->buildSingleValueResponse(self::KEY, 'int', $result);

        $this->close();

        return $statistic;
    }

    /**
     * @param string $id
     * @return aCase
     */

    protected function getCase(string $id): aCase
    {
        /** @var aCase $case */
        $case = BeanFactory::getBean('Cases', $id);

        return $case;
    }


}
