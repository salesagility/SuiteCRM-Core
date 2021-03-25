<?php

namespace App\Statistics\LegacyHandler;

use aCase;
use App\Data\LegacyHandler\PresetDataHandlers\SubpanelDataQueryHandler;
use App\Entity\Statistic;
use App\Service\StatisticsProviderInterface;
use BeanFactory;
use Psr\Log\LoggerAwareInterface;
use Psr\Log\LoggerInterface;

class CasesPerAccount extends SubpanelDataQueryHandler implements StatisticsProviderInterface, LoggerAwareInterface
{
    use StatisticsHandlingTrait;

    public const KEY = 'cases-per-account';

    /**
     * @var LoggerInterface
     */
    private $logger;

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

        $bean = $this->getCase($id);

        if ($bean === null) {
            $this->logger->error('CasesPerAccount: Unable to load case bean with id: ' . $id);

            return $this->getEmptyResponse(self::KEY);
        }

        $accountID = $this->getCase($id)->account_id;
        $module = 'accounts';
        $queries = $this->getQueries($module, $accountID, $subpanel);
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
     * @return aCase|null
     */
    protected function getCase(string $id): ?aCase
    {
        /** @var aCase $case */
        $case = BeanFactory::getBean('Cases', $id);

        if ($case === false) {
            $case = null;
        }

        return $case;
    }

    /**
     * @inheritDoc
     */
    public function setLogger(LoggerInterface $logger): void
    {
        $this->logger = $logger;
    }
}
