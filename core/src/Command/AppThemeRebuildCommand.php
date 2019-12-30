<?php

namespace App\Command;

use Exception;
use Psr\Log\LoggerInterface;
use RuntimeException;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Command\Command;

/**
 * Class AppThemeRebuildCommand
 * @package App\Command
 */
class AppThemeRebuildCommand extends Command
{
    /**
     * @var string
     */
    protected static $defaultName = 'suitecrm:app:theme:rebuild';

    /**
     * @var string
     */
    protected $projectDir;

    /**
     * @var LoggerInterface
     */
    protected $logger;

    /**
     * AppThemeRebuildCommand constructor.
     * @param string $projectDir
     * @param LoggerInterface $logger
     * @param string|null $name
     */
    public function __construct(string $projectDir, LoggerInterface $logger, string $name = null)
    {
        parent::__construct($name);
        $this->projectDir = $projectDir;
        $this->logger = $logger;
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return void
     * @throws Exception
     */
    public function execute(InputInterface $input, OutputInterface $output)
    {
        if (!file_exists($this->projectDir . '/cache/app/engine/')) {
            throw new RuntimeException(
                "Can't find application engine folder, Please run bin/console app:rebuild"
            );
        }

        $watchCompiler = '';

        $optionValue = $input->getOption('watch');

        if ($optionValue === true) {
            $watchCompiler = '--watch';
        }

        chdir($this->projectDir . '/cache/app/engine/');

        shell_exec(
            $this->projectDir . "/node_modules/.bin/node-sass $watchCompiler --output-style compressed src/assets/themes/suite8/css/style.scss > src/assets/themes/suite8/css/style.min.css"
        );

        $compiledThemeDir = 'src/assets/themes/*/css/';
        $compiledThemeFile = 'style.min.css';

        $compiledFilesCheck = shell_exec("find $compiledThemeDir -name '$compiledThemeFile' -print");

        if ($compiledFilesCheck === null) {
            throw new RuntimeException(
                'Compiled theme files have failed to create. Check that the SuiteCRM 8 source theme files exist.'
            );
        }
    }

    protected function configure(): void
    {
        $this
            ->setDescription('Rebuild the theme')
            ->setHelp('This command will rebuild the theme')
            ->addOption(
                'watch',
                '',
                InputOption::VALUE_NONE,
                'Option to allow developers to watch SASS files during compile'
            );
    }
}
