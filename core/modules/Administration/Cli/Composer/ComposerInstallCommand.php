<?php

namespace SuiteCRM\Core\Modules\Administration\Cli\Composer;

use SuiteCRM\Core\Base\Cli\SuiteCommand;
use SuiteCRM\Core\Base\Helper\File\File;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\InputOption;

/**
 * Class ComposerInstallCommand
 * @package SuiteCRM\Core\Modules\Administration\Cli\Setup
 */
class ComposerInstallCommand extends SuiteCommand
{
    protected $file;
    protected $config;

    /**
     * ComposerInstallCommand constructor.
     * @param array $config
     */
    public function __construct($config = [])
    {
        parent::__construct();
        $this->config = $config;
        $this->file = new File();
    }

    protected function configure(): void
    {
        $this
            ->setName('composer:install')
            ->setDescription('Install core composer dependencies')
            ->setHelp('This command will install all required project dependencies')
            ->addOption(
                'nodev',
                '',
                InputOption::VALUE_NONE,
                'Install without dev packages'
            );
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int|void|null
     */
    public function execute(InputInterface $input, OutputInterface $output)
    {
        $currentDir = __DIR__ . '/../../../../../';

        $optionValue = $input->getOption('nodev');
        $noDev = ($optionValue !== false);

        if ($noDev === true) {
            shell_exec('composer install --no-dev');
            chdir($currentDir . 'legacy');

            shell_exec('composer install --no-dev');
            chdir($currentDir);
        }

        shell_exec('composer install');
        chdir($currentDir . 'legacy');

        shell_exec('composer install');
        chdir($currentDir);
    }
}
