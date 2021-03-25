<?php

namespace App\Statistics\LegacyHandler;

use aCase;
use App\Data\LegacyHandler\AuditQueryingTrait;
use App\Entity\Statistic;
use App\Engine\LegacyHandler\LegacyHandler;
use App\Engine\LegacyHandler\LegacyScopeState;
use App\Service\ModuleNameMapperInterface;
use App\Service\StatisticsProviderInterface;
use BeanFactory;
use Doctrine\DBAL\DBALException;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use SugarBean;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class CaseDaysOpen extends LegacyHandler implements StatisticsProviderInterface
{
    use DateTimeStatisticsHandlingTrait;
    use AuditQueryingTrait;

    public const HANDLER_KEY = 'case-days-open';
    public const KEY = 'case-days-open';

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

        if ($legacyModuleName !== 'Cases') {
            return $this->getEmptyResponse(self::KEY);
        }

        $this->init();
        $this->startLegacyApp();

        $case = $this->getCase($id);
        $rows = $this->getAuditInfo($case);

        $start = $case->date_entered;

        $end = null;

        if ($this->inClosedState($case)) {
            $end = $case->date_entered;
            if (!empty($rows) && !empty($rows[$this->getClosedStatus()])) {
                $end = $rows[$case->state]['last_update'] ?? $case->date_entered;
            }
        }

        $statistic = $this->getDateDiffStatistic(self::KEY, $start, $end);

        if ($this->inClosedState($case)) {
            $this->addMetadata($statistic, ['labelKey' => 'LBL_WAS_OPEN', 'endLabelKey' => 'LBL_STAT_DAYS']);
        } else {
            $this->addMetadata($statistic, ['labelKey' => 'LBL_HAS_BEEN_OPEN', 'endLabelKey' => 'LBL_STAT_DAYS']);
        }

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

    /**
     * @param SugarBean $bean
     * @return array
     * @throws DBALException
     */
    protected function getAuditInfo(SugarBean $bean): array
    {
        return $this->queryAuditInfo($this->entityManager, $bean, 'state');
    }

    /**
     * @param aCase $case
     * @return bool
     */
    protected function inClosedState(aCase $case): bool
    {
        return $case->state === 'Closed';
    }

    /**
     * @return string
     */
    protected function getClosedStatus(): string
    {
        return 'Closed';
    }

}
