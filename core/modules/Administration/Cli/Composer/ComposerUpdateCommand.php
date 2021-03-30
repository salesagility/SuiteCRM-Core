<?php

namespace SuiteCRM\Core\Modules\Administration\Cli\Composer;

use SuiteCRM\Core\Base\Cli\SuiteCommand;
use SuiteCRM\Core\Base\Helper\File\File;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Class ComposerUpdateCommand
 * @package SuiteCRM\Core\Modules\Administration\Cli\Setup
 */
class ComposerUpdateCommand extends SuiteCommand
{
    protected $file;
    protected $config;

    /**
     * ComposerUpdateCommand constructor.
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
            ->setName('composer:update')
            ->setDescription('Update core composer dependencies')
            ->setHelp('This command will install all required project dependencies');
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int|void|null
     */
    public function execute(InputInterface $input, OutputInterface $output)
    {
        $currentDir = __DIR__ . '/../../../../../';

        shell_exec('composer update');
        chdir($currentDir . 'legacy');

        shell_exec('composer update');
        chdir($currentDir);
    }
}
