<?php

namespace App\Engine\LegacyHandler;

use ActionNameMapper;
use App\Process\Service\ActionNameMapperInterface;

class ActionNameMapperHandler extends LegacyHandler implements ActionNameMapperInterface
{
    public const HANDLER_KEY = 'action-name-mapper';
    /**
     * Lazy initialized mapper
     * @var ActionNameMapper
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
    public function toFrontend(string $action): string
    {
        $this->init();

        $mapper = $this->getMapper();

        $result = $mapper->toFrontend($action);

        $this->close();

        return $result;
    }

    /**
     * Get mapper. Initialize it if needed
     * @return ActionNameMapper
     */
    protected function getMapper(): ActionNameMapper
    {
        if ($this->mapper !== null) {
            return $this->mapper;
        }

        /* @noinspection PhpIncludeInspection */
        require_once 'include/portability/ActionNameMapper.php';

        $this->mapper = new ActionNameMapper();

        return $this->mapper;
    }

    /**
     * @inheritDoc
     */
    public function toLegacy(string $action): string
    {
        $this->init();

        $mapper = $this->getMapper();

        $result = $mapper->toLegacy($action);

        $this->close();

        return $result;
    }

    /**
     * @inheritDoc
     */
    public function isValidAction(?string $action): bool
    {
        $this->init();

        $mapper = $this->getMapper();

        $result = $mapper->isValidAction($action);

        $this->close();

        return $result;
    }

    /**
     * @inheritDoc
     */
    public function getMap(): array
    {
        $this->init();

        $mapper = $this->getMapper();

        $result = $mapper->getMap();

        $this->close();

        return $result;
    }
}
