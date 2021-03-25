<?php

namespace App\SystemConfig\LegacyHandler;

use App\SystemConfig\Entity\SystemConfig;
use App\Service\ModuleNameMapperInterface;

class DefaultModuleConfigMapper implements SystemConfigMapperInterface
{
    /**
     * @var ModuleNameMapperInterface
     */
    private $moduleNameMapper;

    /**
     * DefaultModuleConfigMapper constructor.
     * @param ModuleNameMapperInterface $moduleNameMapper
     */
    public function __construct(ModuleNameMapperInterface $moduleNameMapper)
    {
        $this->moduleNameMapper = $moduleNameMapper;
    }

    /**
     * @inheritDoc
     */
    public function getKey(): string
    {
        return 'default_module';
    }

    /**
     * @inheritDoc
     */
    public function map(SystemConfig $config): void
    {
        if (empty($config->getValue())) {
            return;
        }

        $frontendName = $this->moduleNameMapper->toFrontEnd($config->getValue());
        $config->setValue($frontendName);
    }
}
