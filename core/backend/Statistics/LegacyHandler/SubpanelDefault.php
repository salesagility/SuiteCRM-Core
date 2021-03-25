<?php

namespace App\Statistics\LegacyHandler;

use App\Entity\Statistic;
use App\Data\LegacyHandler\PresetDataHandlers\SubpanelDataQueryHandler;
use App\Service\StatisticsProviderInterface;
use Psr\Log\LoggerAwareInterface;
use Psr\Log\LoggerInterface;

class SubpanelDefault extends SubpanelDataQueryHandler implements StatisticsProviderInterface, LoggerAwareInterface
{
    use StatisticsHandlingTrait;

    public const KEY = 'default';

    /**
     * @var LoggerInterface
     */
    protected $logger;

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

        $subpanel = $query['params']['subpanel'] ?? $query['key'];

        [$module, $id] = $this->extractContext($query);
        if (empty($module) || empty($id)) {
            return $this->getEmptyResponse(self::KEY);
        }

        $this->init();
        $this->startLegacyApp();

        $queries = $this->getQueries($module, $id, $subpanel);

        if (empty($queries)) {
            $this->logger->error('default-statistic: No queries found.', ['query' => $query]);

            return $this->getErrorResponse(self::KEY);
        }

        $parts = $queries[0];
        $parts['select'] = 'SELECT COUNT(*) as value';

        $dbQuery = $this->joinQueryParts($parts);
        $result = $this->fetchRow($dbQuery);
        $statistic = $this->buildSingleValueResponse(self::KEY, 'int', $result);

        $this->addMetadata($statistic, ['tooltip_title_key' => 'LBL_DEFAULT_TOTAL_TOOLTIP']);
        $this->addMetadata($statistic, ['descriptionKey' => 'LBL_DEFAULT_TOTAL']);
        $this->close();

        return $statistic;
    }

    /**
     * @inheritDoc
     */
    public function setLogger(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }
}
