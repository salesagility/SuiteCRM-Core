<?php

namespace App\Service;

use ApiPlatform\Core\Exception\ItemNotFoundException;

class StatisticsProviderRegistry
{
    protected const MSG_HANDLER_NOT_FOUND = 'Statistics provider is not defined';

    /**
     * @var StatisticsProviderInterface[]
     */
    protected $registry = [];

    /**
     * StatisticsProviderRegistry constructor.
     * @param iterable $handlers
     */
    public function __construct(iterable $handlers)
    {
        foreach ($handlers as $handler) {
            $type = $handler->getKey();
            $this->registry[$type] = $handler;
        }

    }

    /**
     * @param String $providerKey
     * @param StatisticsProviderInterface $provider
     */
    public function register(String $providerKey, StatisticsProviderInterface $provider): void
    {
        $this->registry[$providerKey] = $provider;
    }

    /**
     * Get the data provider for the statistics
     * @param string $providerKey
     * @return StatisticsProviderInterface
     */
    public function get(string $providerKey): StatisticsProviderInterface
    {

        if (empty($this->registry[$providerKey])) {
            throw new ItemNotFoundException(self::MSG_HANDLER_NOT_FOUND);
        }

        return $this->registry[$providerKey];
    }

    /**
     * Check if data provider for the statistics exists
     * @param string $providerKey
     * @return bool
     */
    public function has(string $providerKey): bool
    {
        return !empty($this->registry[$providerKey]);
    }
}
