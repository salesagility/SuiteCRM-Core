<?php

namespace App\Module\LegacyHandler\Favorites;

use App\Engine\LegacyHandler\LegacyHandler;
use App\Engine\LegacyHandler\LegacyScopeState;
use App\Module\Service\FavoriteProviderInterface;
use App\Module\Service\ModuleNameMapperInterface;
use FavoritesManagerPort;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Class FavoritesHandler
 * @package App\Module\Favorites\RecentlyViewed
 */
class FavoritesHandler extends LegacyHandler implements FavoriteProviderInterface
{
    protected const HANDLER_KEY = 'favorites-handler';

    /**
     * @var ModuleNameMapperInterface
     */
    protected $moduleNameMapper;

    /**
     * FavoritesHandler constructor.
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
     * @inheritDoc
     */
    public function isFavorite(string $module, string $id): bool
    {
        $this->init();
        $this->startLegacyApp();

        $legacyModule = $this->moduleNameMapper->toLegacy($module);

        /* @noinspection PhpIncludeInspection */
        require_once 'include/portability/Services/Favorites/FavoritesManagerPort.php';

        $favoritesManager = new FavoritesManagerPort();

        $result = $favoritesManager->isFavorite($legacyModule, $id);

        $this->close();

        return $result;
    }

    /**
     * @inheritDoc
     */
    public function getModuleFavorites(string $module): ?array
    {
        $this->init();
        $this->startLegacyApp();

        $legacyModule = $this->moduleNameMapper->toLegacy($module);

        /* @noinspection PhpIncludeInspection */
        require_once 'include/portability/Services/Favorites/FavoritesManagerPort.php';

        $favoritesManager = new FavoritesManagerPort();

        $result = $favoritesManager->getModuleFavorites($legacyModule);

        $this->close();

        return $result;
    }

}
