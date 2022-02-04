<?php

namespace App\Module\LegacyHandler\RecentlyViewed;

use App\Engine\LegacyHandler\LegacyHandler;
use App\Engine\LegacyHandler\LegacyScopeState;
use App\Module\Service\ModuleNameMapperInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use TrackerManagerPort;

/**
 * Class RecentlyViewedHandler
 * @package App\Module\LegacyHandler\RecentlyViewed
 */
class RecentlyViewedHandler extends LegacyHandler
{
    protected const HANDLER_KEY = 'recently-viewed-handler';

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * LegacyHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param SessionInterface $session
     * @param ModuleNameMapperInterface $moduleNameMapper
     */
    public function __construct(
        string $projectDir,
        string $legacyDir,
        string $legacySessionName,
        string $defaultSessionName,
        LegacyScopeState $legacyScopeState,
        SessionInterface $session,
        ModuleNameMapperInterface $moduleNameMapper
    ) {
        parent::__construct(
            $projectDir,
            $legacyDir,
            $legacySessionName,
            $defaultSessionName,
            $legacyScopeState,
            $session
        );
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
     * @param string $module
     * @return array
     */
    public function getModuleTrackers(string $module): ?array
    {
        $this->init();
        $this->startLegacyApp();

        $legacyModule = $this->moduleNameMapper->toLegacy($module);

        /* @noinspection PhpIncludeInspection */
        require_once 'include/portability/Services/Trackers/TrackerManagerPort.php';

        $trackerManager = new TrackerManagerPort();

        $result = $trackerManager->getModule([$legacyModule]);

        $this->close();

        return $result;
    }

}
