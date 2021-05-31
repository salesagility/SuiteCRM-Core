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

use App\Install\Service\Upgrade\UpgradeHandlerInterface;
use Exception;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\Question;

/**
 * Class UpgradeCommand
 * @package App\Install\Command
 */
class UpgradeCommand extends BaseCommand
{
    /**
     * @var string
     */
    protected static $defaultName = 'suitecrm:app:upgrade';

    /**
     * @var UpgradeHandlerInterface
     */
    protected $handler;

    /**
     * UpgradeCommand constructor.
     * @param UpgradeHandlerInterface $handler
     */
    public function __construct(UpgradeHandlerInterface $handler)
    {
        $this->handler = $handler;

        $this->inputConfig['target-version'] = [
            'question' => new Question('Please enter the version to move to: '),
            'argument' => new InputOption(
                'target-version',
                't',
                InputOption::VALUE_REQUIRED,
                'Target Version'
            )
        ];

        $this->initSession = true;

        parent::__construct();
    }

    /**
     * @inheritDoc
     * @throws Exception
     */
    public function executeCommand(InputInterface $input, OutputInterface $output, array $arguments): int
    {
        $output->writeln([
            '',
            'SuiteCRM Upgrade',
            '============',
            '',
        ]);

        $version = $arguments['target-version'];
        $context = [
            'version' => $version
        ];

        $position = 0;
        $success = true;

        do {
            $keys = $this->handler->getPositionKeys($position);

            $output->writeln('Running: ' . implode(' | ', $keys));

            $result = $this->handler->runPosition($position, $context);

            foreach ($result->getFeedback() as $key => $feedback) {
                $this->writeStepFeedback($key, $output, $feedback);
            }

            $success = $success && $result->isSuccess();

            $position++;

        } while ($success === true && $this->handler->hasPosition($position));

        $output->writeln([
            '',
            '============',
        ]);

        if ($success === false) {
            return 1;
        }

        return 0;
    }

    protected function configure(): void
    {
        parent::configure();

        $this->setDescription('Upgrade the application')
            ->setHelp('This command will upgrade suite 8 and legacy application');
    }
}
