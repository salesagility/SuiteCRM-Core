<?php

namespace App\DateTime\LegacyHandler;

use App\Engine\LegacyHandler\LegacyHandler;
use App\Engine\LegacyHandler\LegacyScopeState;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use DateFormatService;

class DateTimeHandler extends LegacyHandler
{
    public const HANDLER_KEY = 'date-time';
    /**
     * @var array
     */
    private $datetimeFormatMap;

    /**
     * @var DateFormatService
     */
    private $formatter;

    /**
     * SystemConfigHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param array $datetimeFormatMap
     * @param SessionInterface $session
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        array $datetimeFormatMap,
        SessionInterface $session
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState, $session);
        $this->datetimeFormatMap = $datetimeFormatMap;
    }

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }

    /**
     * Map Datetime format
     * @param string $format
     * @return string
     */
    public function mapFormat(string $format): string
    {
        return strtr($format, $this->datetimeFormatMap);
    }

    /**
     * To user date format
     * @param string $dateString
     * @return string
     */
    public function toUserDate(string $dateString): string
    {
        return $this->getFormatter()->toUserDate($dateString);
    }

    /**
     * To user date format
     * @param string $dateString
     * @return string
     */
    public function toUserDateTime(string $dateString): string
    {
        return $this->getFormatter()->toUserDateTime($dateString);
    }

    /**
     * @return DateFormatService
     */
    protected function getFormatter(): DateFormatService
    {
        if ($this->formatter !== null) {
            return $this->formatter;
        }

        /* @noinspection PhpIncludeInspection */
        require_once 'include/portability/Services/DateTime/DateFormatService.php';
        $this->formatter = new DateFormatService();

        return $this->formatter;
    }
}
