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

namespace App\Install\Command;

use App\Engine\Service\ProcessSteps\ProcessStepExecutorInterface;
use Exception;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

abstract class BaseStepExecutorCommand extends BaseCommand
{

    /**
     * @inheritDoc
     * @throws Exception
     */
    public function executeCommand(InputInterface $input, OutputInterface $output, array $arguments): int
    {
        $output->writeln([
            '',
            $this->getTitle(),
            '============',
            '',
        ]);

        $context = $this->getContext($arguments);

        $success = $this->runSteps($output, $context);

        $output->writeln([
            '',
            '============',
        ]);

        if ($success === false) {
            return 1;
        }

        return 0;
    }

    /**
     * @return string
     */
    abstract protected function getTitle(): string;

    /**
     * @param array $arguments
     * @return array
     */
    abstract protected function getContext(array $arguments): array;

    /**
     * @param OutputInterface $output
     * @param array $context
     * @return bool
     */
    protected function runSteps(OutputInterface $output, array $context): bool
    {
        $position = 0;
        $success = true;

        do {
            $keys = $this->getHandler()->getPositionKeys($position);

            $output->writeln('Running: ' . implode(' | ', $keys));

            $result = $this->getHandler()->runPosition($position, $context);

            foreach ($result->getFeedback() as $key => $feedback) {
                $this->writeStepFeedback($key, $output, $feedback);
            }

            $success = $success && $result->isSuccess();

            $position++;

        } while ($success === true && $this->getHandler()->hasPosition($position));

        return $success;
    }

    /**
     * @return ProcessStepExecutorInterface
     */
    abstract protected function getHandler(): ProcessStepExecutorInterface;
}
