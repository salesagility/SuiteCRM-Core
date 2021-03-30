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

use App\Install\LegacyHandler\InstallHandler;
use Exception;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\ChoiceQuestion;
use Symfony\Component\Console\Question\Question;

/**
 * Class LegacyInstallCommand
 * @package App\Command
 */
class LegacyInstallCommand extends Command
{
    /**
     * @var string
     */
    protected static $defaultName = 'suitecrm:app:install';

    /**
     * @var InstallHandler
     */
    protected $installHandler;

    /**
     * @var array
     */
    protected $inputs = [];

    /**
     * LegacyInstallCommand constructor.
     * @param InstallHandler $installHandler
     */
    public function __construct(InstallHandler $installHandler)
    {

        $this->inputs['db_username'] = [
            'question' => new Question('Please enter the db username: '),
            'argument' => new InputOption(
                'db_username',
                'U',
                InputOption::VALUE_REQUIRED,
                'database username'
            )
        ];

        $dbPasswordQuestion = new Question('Please enter the db password: ');
        $dbPasswordQuestion->setHidden(true);
        $dbPasswordQuestion->setHiddenFallback(false);
        $this->inputs['db_password'] = [
            'question' => $dbPasswordQuestion,
            'argument' => new InputOption(
                'db_password',
                'P',
                InputOption::VALUE_REQUIRED,
                'database password'
            ),
        ];

        $this->inputs['db_host'] = [
            'question' => new Question('Please enter the db host: '),
            'argument' => new InputOption(
                'db_host',
                'H',
                InputOption::VALUE_REQUIRED,
                'database host'
            )
        ];

        $this->inputs['db_name'] = [
            'question' => new Question('Please enter the db name: '),
            'argument' => new InputOption(
                'db_name',
                'N',
                InputOption::VALUE_REQUIRED,
                'database name'
            ),
        ];

        $this->inputs['site_username'] = [
            'question' => new Question('Please enter the admin username: '),
            'argument' => new InputOption(
                'site_username',
                'u',
                InputOption::VALUE_REQUIRED,
                'site username'
            ),
        ];

        $adminPasswordQuestion = new Question('Please enter the admin password: ');
        $adminPasswordQuestion->setHidden(true);
        $adminPasswordQuestion->setHiddenFallback(false);
        $this->inputs['site_password'] = [
            'question' => $adminPasswordQuestion,
            'argument' => new InputOption(
                'site_password',
                'p',
                InputOption::VALUE_REQUIRED,
                'site password'
            ),
        ];

        $this->inputs['site_host'] = [
            'question' => new Question('Please enter the suite 8 address (e.g. https://<your_host/): '),
            'argument' => new InputOption(
                'site_host',
                'S',
                InputOption::VALUE_REQUIRED,
                'site host'
            ),
        ];

        $this->inputs['demoData'] = [
            'question' => new ChoiceQuestion(
                'Install demo data?: ',
                ['yes', 'no'],
                'no'
            ),
            'argument' => new InputOption(
                'demoData',
                'd',
                InputOption::VALUE_OPTIONAL,
                'Install "demo data" during install process'
            ),
        ];

        parent::__construct();
        $this->installHandler = $installHandler;
    }

    protected function configure(): void
    {
        $inputs = [];

        foreach ($this->inputs as $key => $item) {
            $inputs[$key] = $item['argument'];
        }

        $this
            ->setDescription('Install the application')
            ->setHelp('This command will install the suite 8 and legacy application')
            ->setDefinition(
                $inputs
            );
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return bool|int|null
     * @throws Exception
     */
    public function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln([
            '',
            'SuiteCRM Silent Install',
            '============',
            '',
        ]);

        if ($this->installHandler->isInstalled()) {
            $output->writeln('Already installed. Stopping');

            return 0;
        }

        $inputArray = [];

        $helper = $this->getHelper('question');

        foreach ($this->inputs as $key => $option) {
            $value = $input->getOption($key);
            if (empty($value)) {
                $value = $helper->ask($input, $output, $option['question']);
            }
            $inputArray[$key] = $value;
        }


        $this->installHandler->createEnv($inputArray);
        $this->installHandler->createConfig($inputArray);

        $output->writeln('Step 1: Config Creation Complete');

        $this->installHandler->installLegacy();

        $output->writeln('Step 2: Legacy Installation Complete');

        return 0;
    }
}
