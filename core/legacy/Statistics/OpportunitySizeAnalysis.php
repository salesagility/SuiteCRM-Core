<?php

namespace App\Legacy\Statistics;

use App\Entity\Statistic;
use App\Legacy\Data\PreparedStatementHandler;
use App\Legacy\Data\PresetDataHandlers\SubpanelDataQueryHandler;
use App\Legacy\Data\SecurityFiltersTrait;
use App\Legacy\LegacyScopeState;
use App\Service\ModuleNameMapperInterface;
use App\Service\StatisticsProviderInterface;
use BeanFactory;
use Doctrine\DBAL\DBALException;
use Opportunity;
use Psr\Log\LoggerAwareInterface;
use Psr\Log\LoggerInterface;
use SugarBean;

class OpportunitySizeAnalysis extends SubpanelDataQueryHandler implements StatisticsProviderInterface, LoggerAwareInterface
{
    use StatisticsHandlingTrait;
    use SecurityFiltersTrait;

    public const KEY = 'opportunity-size-analysis';

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var PreparedStatementHandler
     */
    private $queryHandler;

    /**
     * LeadDaysOpen constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param PreparedStatementHandler $preparedStatementHandler
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        ModuleNameMapperInterface $moduleNameMapper,
        PreparedStatementHandler $preparedStatementHandler
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState,
            $moduleNameMapper);
        $this->queryHandler = $preparedStatementHandler;
    }

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
            return $this->closeAndReturnEmpty();
        }

        if ($module !== 'opportunities') {
            $this->logger->error('OpportunitySizeAnalysis: incorrect module specified in context: ' . $module);

            return $this->closeAndReturnEmpty();
        }

        $this->init();
        $this->startLegacyApp();

        $bean = $this->getOpportunity($id);

        if ($bean === null) {
            $this->logger->error('OpportunitySizeAnalysis: Unable to load opportunity bean with id: ' . $id);

            return $this->closeAndReturnEmpty();
        }

        $queryStatuses = $this->getQuerySalesStages($bean);

        try {
            $result = $this->runQuery($bean, $id, $queryStatuses);
        } catch (DBALException $e) {
            $this->logger->error(
                'OpportunitySizeAnalysis: exception executing query',
                [
                    'exception' => $e
                ]
            );

            return $this->closeAndReturnEmpty();
        }

        if (empty($result)) {
            return $this->closeAndReturnEmpty();
        }

        $statistic = $this->buildNumberResult($result, 'int');

        $this->close();

        return $statistic;
    }

    /**
     * @return Statistic
     */
    protected function closeAndReturnEmpty(): Statistic
    {
        $statistic = $this->getEmptyResponse(self::KEY);
        $this->close();

        return $statistic;
    }

    /**
     * @param $id
     * @return Opportunity|null
     */
    protected function getOpportunity($id): ?Opportunity
    {
        /** @var Opportunity $bean */
        $bean = BeanFactory::getBean('Opportunities', $id);

        if ($bean === false) {
            $bean = null;
        }

        return $bean;
    }

    /**
     * @param Opportunity|null $bean
     * @return array|String[]
     */
    protected function getQuerySalesStages(?Opportunity $bean): array
    {
        if ($bean === null) {
            return [];
        }

        $closedStatuses = $this->getClosedSalesStages();
        $openStatuses = $this->getOpenSalesStages();

        $queryStatuses = $openStatuses;
        if (in_array($bean->sales_stage, $closedStatuses, true)) {
            $queryStatuses = $closedStatuses;
        }

        return $queryStatuses;
    }

    /**
     * @return String[]
     */
    protected function getClosedSalesStages(): array
    {
        return ['Closed Won', 'Closed Lost'];
    }

    /**
     * @return String[]
     */
    protected function getOpenSalesStages(): array
    {
        return [
            'Prospecting',
            'Qualification',
            'Needs Analysis',
            'Value Proposition',
            'Id. Decision Makers',
            'Perception Analysis',
            'Proposal/Price Quote',
            'Negotiation/Review'
        ];
    }

    /**
     * @param SugarBean $bean
     * @param string $id
     * @param array $statuses
     * @return mixed|false
     * @throws DBALException
     */
    protected function runQuery(SugarBean $bean, string $id, array $statuses)
    {
        $params = [
            'id' => $id,
        ];
        $binds = [];

        $securityWhereClause = $this->addSecurityWhereClause($bean, '', 'T2');

        if (!empty($securityWhereClause)) {
            $securityWhereClause = ' AND ' . $securityWhereClause;
        }

        $statusClause = '';
        if (!empty($statuses)) {
            $statusClause = " AND T2.sales_stage IN ('" . implode("','", $statuses) . "')";
        }

        $queryString = "
            SELECT (
                SELECT COUNT(*)
                   FROM opportunities T2
                   WHERE T2.assigned_user_id = T1.assigned_user_id
                   AND T2.deleted = '0' AND T1.deleted = '0'
                     AND (
                         T2.amount > T1.amount OR
                         (
                             T2.amount = T1.amount AND
                             T2.date_entered < T1.date_entered
                         )
                     )
                     $statusClause
                     $securityWhereClause
            ) + 1 AS value
            FROM opportunities T1
            WHERE T1.id = :id
            ORDER BY T1.amount DESC;
        ";

        return $this->queryHandler->fetch(
            $queryString,
            $params,
            $binds
        );
    }

    /**
     * @inheritDoc
     */
    public function setLogger(LoggerInterface $logger): void
    {
        $this->logger = $logger;
    }
}
