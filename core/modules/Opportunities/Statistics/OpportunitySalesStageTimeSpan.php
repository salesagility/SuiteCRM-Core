<?php

namespace App\Module\Opportunities\Statistics;

use App\Data\LegacyHandler\AuditQueryingTrait;
use App\Statistics\DateTimeStatisticsHandlingTrait;
use App\Statistics\Entity\Statistic;
use App\Engine\LegacyHandler\LegacyHandler;
use App\Engine\LegacyHandler\LegacyScopeState;
use App\Module\Service\ModuleNameMapperInterface;
use App\Statistics\Service\StatisticsProviderInterface;
use BeanFactory;
use Doctrine\DBAL\DBALException;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Opportunity;
use SugarBean;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class OpportunitySalesStageTimeSpan extends LegacyHandler implements StatisticsProviderInterface
{
    use DateTimeStatisticsHandlingTrait;
    use AuditQueryingTrait;

    public const HANDLER_KEY = 'opportunity-sales-stage-time-span';
    public const KEY = 'opportunity-sales-stage-time-span';

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    /**
     * ListDataHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param EntityManagerInterface $entityManager
     * @param SessionInterface $session
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        ModuleNameMapperInterface $moduleNameMapper,
        EntityManagerInterface $entityManager,
        SessionInterface $session
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState, $session);
        $this->moduleNameMapper = $moduleNameMapper;
        $this->entityManager = $entityManager;
    }

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
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
     * @throws Exception
     */
    public function getData(array $query): Statistic
    {
        [$module, $id] = $this->extractContext($query);

        if (empty($module) || empty($id)) {
            return $this->getEmptyResponse(self::KEY);
        }

        $legacyModuleName = $this->moduleNameMapper->toLegacy($module);

        if ($legacyModuleName !== 'Opportunities') {
            return $this->getEmptyResponse(self::KEY);
        }

        $this->init();
        $this->startLegacyApp();

        $opp = $this->getOpportunity($id);

        $rows = $this->getAuditInfo($opp);

        if ($this->inClosedStatus($opp)) {

            $end = $rows[$opp->sales_stage]['last_update'] ?? $opp->date_entered;

            $statistic = $this->getDateDiffStatistic(self::KEY, $opp->date_entered, $end);

            $this->addMetadata($statistic, ['labelKey' => 'LBL_DAYS_OPEN_FOR']);

        } else {

            $start = $opp->date_entered;

            if (!empty($rows)) {
                $start = $rows[$opp->sales_stage]['last_update'] ?? $opp->date_entered;
            }

            $statistic = $this->getDateDiffStatistic(self::KEY, $start);
            $this->addMetadata($statistic, ['labelKey' => 'LBL_DAYS_IN_SALE_STAGE']);
        }

        $this->close();

        return $statistic;
    }

    /**
     * @param $id
     * @return Opportunity
     */
    protected function getOpportunity($id): Opportunity
    {
        /** @var Opportunity $opp */
        $opp = BeanFactory::getBean('Opportunities', $id);

        return $opp;
    }

    /**
     * @param SugarBean $bean
     * @return array
     * @throws DBALException
     */
    protected function getAuditInfo(SugarBean $bean): array
    {
        return $this->queryAuditInfo($this->entityManager, $bean, 'sales_stage', [], 'after_value_string');
    }

    /**
     * @param Opportunity $opp
     * @return bool
     */
    protected function inClosedStatus(Opportunity $opp): bool
    {
        return $opp->sales_stage === 'Closed Won' || $opp->sales_stage === 'Closed Lost';
    }
}
