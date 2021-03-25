<?php

namespace App\Install\Command;

use App\Install\LegacyHandler\InstallHandler;
use Exception;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputDefinition;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

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
    private $installHandler;

    /**
     * LegacyInstallCommand constructor.
     * @param InstallHandler $installHandler
     */
    public function __construct(InstallHandler $installHandler)
    {
        parent::__construct();
        $this->installHandler = $installHandler;
    }

    protected function configure(): void
    {
        $this
            ->setDescription('Install the legacy application')
            ->setHelp('This command will install the legacy application')
            ->setDefinition(
                new InputDefinition([
                    new InputArgument(
                        'db_username',
                        InputOption::VALUE_REQUIRED,
                        'database username'
                    ),
                    new InputArgument(
                        'db_password',
                        InputOption::VALUE_REQUIRED,
                        'database password'
                    ),
                    new InputArgument(
                        'db_host',
                        InputOption::VALUE_REQUIRED,
                        'database host'
                    ),
                    new InputArgument(
                        'db_name',
                        InputOption::VALUE_REQUIRED,
                        'database name'
                    ),
                    new InputArgument(
                        'site_username',
                        InputOption::VALUE_REQUIRED,
                        'site username'
                    ),
                    new InputArgument(
                        'site_password',
                        InputOption::VALUE_REQUIRED,
                        'site password'
                    ),
                    new InputArgument(
                        'site_host',
                        InputOption::VALUE_REQUIRED,
                        'site host'
                    ),
                    new InputOption(
                        'demo',
                        'd',
                        InputOption::VALUE_REQUIRED,
                        'Install "demo data" during install process'
                    ),
                ])
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

        $demoData = $input->getOption('demo');
        $demoDataOutput = ($demoData !== false);

        $inputArray = [
            'db_username' => $input->getArgument('db_username'),
            'db_password' => $input->getArgument('db_password'),
            'db_host' => $input->getArgument('db_host'),
            'db_name' => $input->getArgument('db_name'),
            'site_username' => $input->getArgument('site_username'),
            'site_password' => $input->getArgument('site_password'),
            'site_host' => $input->getArgument('site_host'),
            'demo' => $demoDataOutput
        ];

        $this->installHandler->createConfig($inputArray);

        $output->writeln('Step 1: Config Creation Complete');

        $this->installHandler->installLegacy();

        $output->writeln('Step 2: Legacy Installation Complete');

        return 0;
    }
}
