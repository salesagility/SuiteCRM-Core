<?php

namespace App\Legacy;

use ClassicViewRoutingExclusionsManager;

class ClassicViewRoutingExclusionsHandler extends LegacyHandler
{
    public const HANDLER_KEY = 'classic-view-routing-exclusions';

    /**
     * Lazy initialized manager
     * @var ClassicViewRoutingExclusionsManager
     */
    protected $manager;

    /**
     * @inheritDoc
     */
    public function getHandlerKey(): string
    {
        return self::HANDLER_KEY;
    }

    /**
     * Get configured exclusions
     * @return array
     */
    public function get(): array
    {
        $this->init();

        $manager = $this->getManager();

        $result = $manager->getExclusions();

        $this->close();

        return $result;
    }

    /**
     * Get manager. Initialize it if needed
     * @return ClassicViewRoutingExclusionsManager
     */
    protected function getManager(): ClassicViewRoutingExclusionsManager
    {
        if ($this->manager !== null) {
            return $this->manager;
        }

        /* @noinspection PhpIncludeInspection */
        require_once 'include/portability/ClassicViewRoutingExclusionsManager.php';

        $this->manager = new ClassicViewRoutingExclusionsManager();

        return $this->manager;
    }
}
