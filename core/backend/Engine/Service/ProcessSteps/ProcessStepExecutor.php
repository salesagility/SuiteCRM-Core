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

namespace App\Engine\Service\ProcessSteps;

use App\Engine\Model\Feedback;
use App\Engine\Model\MultiFeedback;
use App\Engine\Model\ProcessStepInterface;
use BadMethodCallException;
use Psr\Log\LoggerInterface;

abstract class ProcessStepExecutor implements ProcessStepExecutorInterface
{
    /**
     * @var LoggerInterface
     */
    protected $logger;

    /**
     * @var ProcessStepInterface[]
     */
    protected $steps;

    /**
     * @var ProcessStepInterface[][]
     */
    protected $orderedSteps;

    /**
     * Run all steps in order
     * @param array $context
     * @return MultiFeedback feedback
     */
    public function runAll(array $context): MultiFeedback
    {
        $result = new MultiFeedback();
        $result->setSuccess(true);

        $context = $context ?? [];
        $context['stepsFeedback'] = [];

        foreach ($this->orderedSteps as $positionSteps) {
            foreach ($positionSteps as $step) {
                $feedback = $step->run($context);

                $context['stepsFeedback'][$step->getKey()] = $feedback;

                if ($feedback->isSuccess() === false) {

                    $result->setSuccess(false);
                    $result->setFeedback($context['stepsFeedback']);

                    return $result;
                }
            }
        }

        $result->setFeedback($context['stepsFeedback']);

        return $result;
    }

    /**
     * @param string $stepKey
     * @param array $context
     * @return Feedback feedback
     */
    public function run(string $stepKey, array $context): Feedback
    {
        if (empty($this->steps[$stepKey])) {
            throw new BadMethodCallException("$stepKey not found");
        }

        $context = $context ?? [];
        $context['stepsFeedback'] = [];

        return $this->steps[$stepKey]->run($context);
    }

    /**
     * Has position
     * @param int $position
     * @return bool
     */
    public function hasPosition(int $position): bool
    {
        $positionSteps = $this->orderedSteps[$position] ?? [];
        if (empty($positionSteps)) {
            return false;
        }

        return true;
    }

    /**
     * Run next
     * @param int $position
     * @param array $context
     * @return MultiFeedback
     */
    public function runPosition(int $position, array $context): MultiFeedback
    {
        $positionSteps = $this->orderedSteps[$position] ?? [];

        if (empty($positionSteps)) {
            $result = new MultiFeedback();
            $result->setSuccess(false);

            return $result;
        }

        $result = new MultiFeedback();
        $result->setSuccess(true);
        $context = $context ?? [];
        $context['stepsFeedback'] = [];

        foreach ($positionSteps as $step) {
            $feedback = $step->run($context);

            $context['stepsFeedback'][$step->getKey()] = $feedback;

            if ($feedback->isSuccess() === false) {
                $result->setSuccess(false);
                break;
            }
        }

        $result->setFeedback($context['stepsFeedback']);

        return $result;
    }

    /**
     * Get position keys
     * @param int $position
     * @return string[]
     */
    public function getPositionKeys(int $position): array
    {
        $positionSteps = $this->orderedSteps[$position] ?? [];
        if (empty($positionSteps)) {
            return [];
        }

        return array_keys($positionSteps);
    }

    /**
     * @param iterable $handlers
     * @param LoggerInterface $logger
     */
    protected function initSteps(iterable $handlers, LoggerInterface $logger): void
    {
        /**
         * @var $ordered ProcessStepInterface[][]
         */
        $ordered = [];

        /**
         * @var $handlers ProcessStepInterface[]
         */
        foreach ($handlers as $step) {
            $key = $step->getKey() ?? '';
            $order = $step->getOrder() ?? count($this->orderedSteps);

            $step->setLogger($logger);

            $positionSteps = $ordered[$order] ?? [];
            $positionSteps[$key] = $step;
            $ordered[$order] = $positionSteps;

            $this->steps[$key] = $step;
        }

        ksort($ordered, SORT_NUMERIC);

        $this->orderedSteps = [];

        foreach ($ordered as $item) {
            $this->orderedSteps[] = $item;
        }
    }
}
