<?php

namespace App\Statistics\LegacyHandler;

use App\Entity\Statistic;
use App\Engine\LegacyHandler\LegacyHandler;
use App\Service\StatisticsProviderInterface;
use BeanFactory;
use DateTime;
use Exception;

/**
 * Class CaseAccountGetDateEntered
 * @package App\Statistics\LegacyHandler
 */
class CaseAccountGetDateEntered extends LegacyHandler implements StatisticsProviderInterface

{
    use StatisticsHandlingTrait;

    public const HANDLER_KEY = 'get-account-date-entered';
    public const KEY = 'get-account-date-entered';

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
        $this->init();
        $this->startLegacyApp();
        $accountId = $this->getAccountId($id);
        $module = 'Accounts';
        $moduleDateEntered = $this->getAccountDateEntered($accountId, $module);
        $date = (new DateTime($moduleDateEntered))->format("Y");
        $statistic = $this->buildSingleValueResponse(self::KEY, 'varchar', ["value" => $date]);
        $this->close();

        return $statistic;
    }

    /**
     * @param string $id
     * @return string
     * @noinspection PhpPossiblePolymorphicInvocationInspection
     */
    protected function getAccountId(string $id): string
    {
        $case = BeanFactory::getBean('Cases', $id);
        if (!$case->account_id) {
            return $this->getEmptyResponse(self::KEY);
        }

        return $case->account_id;
    }

    /**
     * @param string $accountId
     * @param string $module
     * @return string
     */
    protected function getAccountDateEntered(string $accountId, string $module): string
    {
        return BeanFactory::getBean($module, $accountId)->date_entered;
    }
}
