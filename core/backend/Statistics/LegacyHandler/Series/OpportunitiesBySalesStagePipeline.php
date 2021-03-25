<?php

namespace App\Statistics\LegacyHandler\Series;

use App\Entity\Statistic;
use App\Data\LegacyHandler\ListDataQueryHandler;
use App\Engine\LegacyHandler\LegacyHandler;
use App\Engine\LegacyHandler\LegacyScopeState;
use App\Statistics\LegacyHandler\StatisticsHandlingTrait;
use App\Model\Statistics\ChartOptions;
use App\Service\ModuleNameMapperInterface;
use App\Service\StatisticsProviderInterface;
use BeanFactory;
use SugarBean;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class OpportunitiesBySalesStagePipeline extends LegacyHandler implements StatisticsProviderInterface
{
    use StatisticsHandlingTrait;

    public const KEY = 'opportunities-by-sales-stage-price';

    /**
     * @var ListDataQueryHandler
     */
    private $queryHandler;

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * LeadDaysOpen constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param ListDataQueryHandler $queryHandler
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param SessionInterface $session
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        ListDataQueryHandler $queryHandler,
        ModuleNameMapperInterface $moduleNameMapper,
        SessionInterface $session
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState, $session);
        $this->queryHandler = $queryHandler;
        $this->moduleNameMapper = $moduleNameMapper;
    }

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return $this->getKey();
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
        [$module, $id, $criteria, $sort] = $this->extractContext($query);

        if (empty($module) || $module !== 'opportunities') {
            return $this->getEmptySeriesResponse(self::KEY);
        }

        $this->init();
        $this->startLegacyApp();

        $legacyName = $this->moduleNameMapper->toLegacy($module);
        $bean = $this->getBean($legacyName);

        if (!$bean instanceof SugarBean) {
            return $this->getEmptySeriesResponse(self::KEY);
        }

        $query = $this->queryHandler->getQuery($bean, $criteria, $sort);

        $query = $this->generateQuery($query);

        $result = $this->runQuery($query, $bean);

        $nameField = 'sales_stage';
        $valueField = 'amount';

        $series = $this->buildSingleSeries($result, $nameField, $valueField);

        $chartOptions = new ChartOptions();
        $chartOptions->yAxisTickFormatting = true;

        $statistic = $this->buildSeriesResponse(self::KEY, 'currency', $series, $chartOptions);

        $this->close();

        return $statistic;
    }

    /**
     * @param string $legacyName
     * @return bool|SugarBean
     */
    protected function getBean(string $legacyName)
    {
        return BeanFactory::newBean($legacyName);
    }

    /**
     * @param array $query
     * @param $bean
     * @return array
     */
    protected function runQuery(array $query, $bean): array
    {
        // send limit -2 to not add a limit
        return $this->queryHandler->runQuery($bean, $query);
    }

    /**
     * @param array $query
     * @return array
     */
    protected function generateQuery(array $query): array
    {
        $query['select'] = 'SELECT opportunities.sales_stage, SUM(opportunities.amount) as amount';
        $query['where'] .= ' AND opportunities.amount is not null AND opportunities.sales_stage is not null ';
        $query['order_by'] = '';
        $query['group_by'] = ' GROUP BY opportunities.sales_stage DESC';

        return $query;
    }
}
