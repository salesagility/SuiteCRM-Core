<?php

namespace App\Legacy\Statistics;

use App\Entity\Statistic;
use App\Legacy\LegacyHandler;
use App\Legacy\LegacyScopeState;
use App\Service\ModuleNameMapperInterface;
use App\Service\StatisticsProviderInterface;
use BeanFactory;
use DateFormatService;
use DateTime;
use Exception;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Task;

/**
 * Class DaysUntilDueTask
 * @package App\Legacy\Statistics
 */
class DaysUntilDueTask extends LegacyHandler implements StatisticsProviderInterface
{
    use DateTimeStatisticsHandlingTrait;

    public const HANDLER_KEY = 'days-until-due-task';
    public const KEY = 'days-until-due-task';

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * ListDataHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param ModuleNameMapperInterface $moduleNameMapper
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        ModuleNameMapperInterface $moduleNameMapper,
        SessionInterface $session
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState, $session);
        $this->moduleNameMapper = $moduleNameMapper;
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

        if ($legacyModuleName !== 'Tasks') {
            return $this->getEmptyResponse(self::KEY);
        }

        $this->init();
        $this->startLegacyApp();

        /* @noinspection PhpIncludeInspection */
        require_once 'include/portability/Services/DateTime/DateFormatService.php';
        $dateFormatService = new DateFormatService();

        $dateDue = $this->getTask($id)->date_due;
        $completed = $this->getTask($id)->status;
        $dbTime = $dateFormatService->toDateTime($dateDue);
        $dateTime = new DateTime();
        $timestamp = $dateTime->getTimestamp();
        $dateComp = $dateFormatService->toDBDateTime($timestamp);


        $statistic = $this->getDateDiffStatistic(self::KEY, $dateDue, $dateComp);

        if ($completed !== 'Completed') {
            if ($dbTime > $dateTime) {
                $this->addMetadata($statistic, ['labelKey' => 'LBL_DAYS_UNTIL_DUE_TASK']);
            } else {
                $this->addMetadata($statistic, ['labelKey' => 'LBL_DAYS_OVERDUE']);
            }
        } else {
            $statistic = $this->getEmptyResponse(self::KEY);
            $this->addMetadata($statistic, ['labelKey' => 'LBL_TASK_COMPLETED', 'endLabelKey' => '']);
        }

        $this->close();

        return $statistic;
    }

    /**
     * @param string $id
     * @return Task
     */
    protected function getTask(string $id): Task
    {
        /** @var Task $task */
        $task = BeanFactory::getBean('Tasks', $id);

        return $task;
    }

}
