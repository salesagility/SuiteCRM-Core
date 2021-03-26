<?php

namespace App\Process\DataPersister;

use ApiPlatform\Core\DataPersister\ContextAwareDataPersisterInterface;
use ApiPlatform\Core\Exception\InvalidResourceException;
use App\Process\Entity\Process;
use App\Service\ProcessHandlerInterface;
use App\Service\ProcessHandlerRegistry;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Security;

class ProcessDataPersister implements ContextAwareDataPersisterInterface
{
    /**
     * @var ProcessHandlerRegistry
     */
    private $registry;
    /**
     * @var Security
     */
    private $security;

    /**
     * ProcessDataPersister constructor.
     * @param ProcessHandlerRegistry $registry
     * @param Security $security
     */
    public function __construct(ProcessHandlerRegistry $registry, Security $security)
    {
        $this->registry = $registry;
        $this->security = $security;
    }

    /**
     * @inheritDoc
     */
    public function supports($data, array $context = []): bool
    {
        return $data instanceof Process;
    }

    /**
     * Handle Process create / update request
     * @param Process $process
     * @param array $context
     * @return Process
     */
    public function persist($process, array $context = []): Process
    {
        $processHandler = $this->registry->get($process->getType());

        $this->checkAuthentication($processHandler);

        $processHandler->validate($process);
        $processHandler->configure($process);

        if ($process->getAsync() === true) {
            // Store process for background processing
            // Not supported yet
        } else {
            $processHandler->run($process);
        }

        return $process;
    }

    /**
     * Check if user has the needed role
     * @param ProcessHandlerInterface $processHandler
     */
    protected function checkAuthentication(ProcessHandlerInterface $processHandler): void
    {
        if (empty($processHandler->requiredAuthRole())) {
            return;
        }

        if ($this->security->isGranted($processHandler->requiredAuthRole()) === true) {
            return;
        }

        throw new AccessDeniedException();
    }

    /**
     * Handler process deletion request
     * @param $data
     * @param array $context
     * @throws InvalidResourceException
     */
    public function remove($data, array $context = [])
    {
        // Deleting processes is not supported
        throw new InvalidResourceException();
    }
}
