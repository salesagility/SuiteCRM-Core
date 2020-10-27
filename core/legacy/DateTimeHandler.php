<?php

namespace App\Legacy;

class DateTimeHandler extends LegacyHandler
{
    public const HANDLER_KEY = 'date-time';
    /**
     * @var array
     */
    private $datetimeFormatMap;


    /**
     * SystemConfigHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param array $datetimeFormatMap
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        array $datetimeFormatMap
    ) {
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState);
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
}
