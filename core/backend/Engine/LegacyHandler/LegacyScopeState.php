<?php

namespace App\Engine\LegacyHandler;


class LegacyScopeState
{
    /**
     * @var string | null
     */
    protected $activeScope;

    /**
     * @var bool
     */
    protected $legacyBootstrapped = false;

    /**
     * @var bool
     */
    protected $legacyStarted = false;

    /**
     * @return string|null
     */
    public function getActiveScope(): ?string
    {
        return $this->activeScope;
    }

    /**
     * @param string|null $activeScope
     * @return LegacyScopeState
     */
    public function setActiveScope(?string $activeScope): LegacyScopeState
    {
        $this->activeScope = $activeScope;

        return $this;
    }

    /**
     * @return bool
     */
    public function isLegacyBootstrapped(): bool
    {
        return $this->legacyBootstrapped;
    }

    /**
     * @param bool $legacyBootstrapped
     * @return LegacyScopeState
     */
    public function setLegacyBootstrapped(bool $legacyBootstrapped): LegacyScopeState
    {
        $this->legacyBootstrapped = $legacyBootstrapped;

        return $this;
    }

    /**
     * @return bool
     */
    public function isLegacyStarted(): bool
    {
        return $this->legacyStarted;
    }

    /**
     * @param bool $legacyStarted
     * @return LegacyScopeState
     */
    public function setLegacyStarted(bool $legacyStarted): LegacyScopeState
    {
        $this->legacyStarted = $legacyStarted;

        return $this;
    }
}
