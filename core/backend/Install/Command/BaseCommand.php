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

use App\Engine\Model\Feedback;
use App\Languages\LegacyHandler\AppStringsHandler;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

abstract class BaseCommand extends Command
{
    /**
     * @var array
     */
    protected $inputConfig = [];

    /**
     * @var bool
     */
    protected $initSession = false;

    /**
     * @var string
     */
    protected $defaultSessionName;

    /**
     * @var SessionInterface
     */
    protected $session;

    /**
     * @var string
     */
    protected $legacySessionName;

    /**
     * @var AppStringsHandler
     */
    protected $appStringsHandler;

    /**
     * @required
     * @param string $defaultSessionName
     */
    public function setDefaultSessionName(string $defaultSessionName): void
    {
        $this->defaultSessionName = $defaultSessionName;
    }

    /**
     * @required
     * @param string $legacySessionName
     */
    public function setLegacySessionName(string $legacySessionName): void
    {
        $this->legacySessionName = $legacySessionName;
    }

    /**
     * @required
     * @param SessionInterface $session
     */
    public function setSession(SessionInterface $session): void
    {
        $this->session = $session;
    }

    /**
     * @required
     * @param AppStringsHandler $appStringsHandler
     */
    public function setAppStringsHandler(AppStringsHandler $appStringsHandler): void
    {
        $this->appStringsHandler = $appStringsHandler;
    }

    /**
     * @inheritDoc
     */
    public function execute(InputInterface $input, OutputInterface $output): int
    {
        $arguments = [];

        $helper = $this->getHelper('question');

        foreach ($this->inputConfig as $key => $option) {
            $value = $input->getOption($key);

            $default = $option['default'] ?? '';
            $required = $option['required'] ?? true;

            if (empty($value) && $required === false && isset($option['default'])) {
                $value = $default;
            } elseif (empty($value)) {
                $value = $helper->ask($input, $output, $option['question']);
            }

            $arguments[$key] = $value;
        }

        if ($this->initSession) {
            $this->startSession();
        }

        return $this->executeCommand($input, $output, $arguments);
    }

    /**
     * Execute command actions
     * @param InputInterface $input
     * @param OutputInterface $output
     * @param array $inputs
     * @return int
     */
    abstract protected function executeCommand(InputInterface $input, OutputInterface $output, array $inputs): int;

    /**
     * @inheritDoc
     */
    protected function configure(): void
    {
        $inputs = [];

        foreach ($this->inputConfig as $key => $item) {
            $inputs[$key] = $item['argument'];
        }

        $this->setDefinition(
            $inputs
        );
    }

    /**
     * Start Session
     */
    protected function startSession(): void
    {
        if ($this->session->isStarted()) {
            return;
        }

        $this->session->setName($this->defaultSessionName);

        $this->session->start();
    }

    /**
     * Write feedback for a given step
     * @param string $step
     * @param OutputInterface $output
     * @param Feedback $feedback
     */
    protected function writeStepFeedback(string $step, OutputInterface $output, Feedback $feedback): void
    {
        $status = '<info>done</info>';
        if ($feedback->isSuccess() === false) {
            $status = '<error>failed</error>';
        }

        $output->writeln('step: ' . $step . ' | status: ' . $status);

        $this->writeFeedbackMessages($output, $feedback);
        $this->writeFeedbackErrors($output, $feedback);
    }

    /**
     * Write feedback messages
     * @param OutputInterface $output
     * @param Feedback $feedback
     */
    protected function writeFeedbackMessages(OutputInterface $output, Feedback $feedback): void
    {
        $messages = $feedback->getMessages() ?? [];

        foreach ($messages as $message) {
            $output->writeln($this->colorMessage($feedback, $message));
        }
    }

    /**
     * Write feedback messages
     * @param OutputInterface $output
     * @param Feedback $feedback
     */
    protected function writeFeedbackErrors(OutputInterface $output, Feedback $feedback): void
    {
        $errors = $feedback->getErrors()['data'] ?? [];

        if (empty($errors)) {
            return;
        }

        $appStrings = $this->getAppStrings();

        foreach ($errors as $error) {

            $details = [];
            $parts = ['label', 'status', 'error', 'info'];

            foreach ($parts as $key) {
                $part = $error[$key] ?? '';
                if ($part === '') {
                    continue;
                }

                $translation = $appStrings[$part] ?? $part;

                $details[] = $translation;
            }

            $message = implode(' | ', $details);

            if ($error['status'] === 'error') {
                $message = '<error>' . $message . '</error>';
            }

            if ($error['status'] === 'warning') {
                $message = '<warning>' . $message . '</warning>';
            }

            $output->writeln($message);
        }
    }

    /**
     * @param Feedback $feedback
     * @param string $message
     * @return string
     */
    protected function colorMessage(Feedback $feedback, string $message): string
    {
        $colorTag = 'info';
        if ($feedback->isSuccess() === false) {
            $colorTag = 'error';
        }

        return implode('', ["<$colorTag>", $message, "</$colorTag>"]);
    }

    /**
     * @return array|null
     */
    protected function getAppStrings(): ?array
    {
        $appStringsEntity = $this->appStringsHandler->getAppStrings('en_us');
        $appStrings = [];

        if ($appStringsEntity) {
            $appStrings = $appStringsEntity->getItems();
        }

        return $appStrings;
    }
}
