<?php

namespace App\Legacy;

use App\Service\ModuleNameMapperInterface;
use ModuleNameMapper;

/**
 * Class ModuleNameMapper
 * @package App\Legacy
 */
class ModuleNameMapperHandler extends LegacyHandler implements ModuleNameMapperInterface
{
    public const HANDLER_KEY = 'module-name-mapper';

    /**
     * Lazy initialized mapper
     * @var ModuleNameMapper
     */
    protected $mapper;

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
    public function isValidModule(string $module): bool
    {
        $this->init();

        $mapper = $this->getMapper();

        $result = $mapper->isValidModule($module);

        $this->close();

        return $result;
    }

    /**
     * @inheritDoc
     */
    public function toFrontEnd(string $module): string
    {
        $this->init();

        $mapper = $this->getMapper();

        $result = $mapper->toFrontEnd($module);

        $this->close();

        return $result;
    }

    /**
     * @inheritDoc
     */
    public function toCore(string $module): string
    {
        $this->init();

        $mapper = $this->getMapper();

        $result = $mapper->toCore($module);

        $this->close();

        return $result;
    }

    /**
     * @inheritDoc
     */
    public function toLegacy(string $module): string
    {
        $this->init();

        $mapper = $this->getMapper();

        $result = $mapper->toLegacy($module);

        $this->close();

        return $result;
    }

    /**
     * @inheritDoc
     */
    public function getLegacyToFrontendMap(): array
    {
        $this->init();

        $mapper = $this->getMapper();

        $result = $mapper->getLegacyToFrontendMap();

        $this->close();

        return $result;
    }


    /**
     * Get mapper. Initialize it if needed
     * @return ModuleNameMapper
     */
    protected function getMapper(): ModuleNameMapper
    {
        if ($this->mapper !== null) {
            return $this->mapper;
        }

        /* @noinspection PhpIncludeInspection */
        require_once 'include/portability/ModuleNameMapper.php';

        $this->mapper = new ModuleNameMapper();

        return $this->mapper;
    }
}
