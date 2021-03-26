<?php

namespace App\Engine\LegacyHandler;

use ACLController;
use App\Engine\Service\AclManagerInterface;
use App\Module\Service\ModuleNameMapperInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class AclHandler extends LegacyHandler implements AclManagerInterface
{
    public const HANDLER_KEY = 'acl-handler';

    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * AclHandler constructor.
     * @param string $projectDir
     * @param string $legacyDir
     * @param string $legacySessionName
     * @param string $defaultSessionName
     * @param LegacyScopeState $legacyScopeState
     * @param ModuleNameMapperInterface $moduleNameMapper
     * @param SessionInterface $session
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
        parent::__construct($projectDir, $legacyDir, $legacySessionName, $defaultSessionName, $legacyScopeState,
            $session);
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
    public function checkAccess(string $module, string $action, bool $isOwner = false): bool
    {
        $this->init();

        $this->startLegacyApp();

        $legacyName = $this->moduleNameMapper->toLegacy($module);

        $hasAccess = ACLController::checkAccess($legacyName, $action, $isOwner);

        $this->close();

        return $hasAccess;
    }
}
