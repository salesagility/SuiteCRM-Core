<?php
/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */


namespace App\Process\DataPersister;

use ApiPlatform\Core\DataPersister\ContextAwareDataPersisterInterface;
use ApiPlatform\Core\Exception\InvalidResourceException;
use App\Process\Entity\Process;
use App\Process\Service\ProcessHandlerRegistry;
use App\Process\Service\ProcessHandlerInterface;
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
