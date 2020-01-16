<?php

namespace SuiteCRM\Core\Modules\Administration\Cli\App;

use SuiteCRM\Core\Base\Cli\SuiteCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\InputOption;

/**
 * Class AppThemeRebuildCommand
 * @package SuiteCRM\Core\Modules\Administration\Cli\App
 */
class AppThemeRebuildCommand extends SuiteCommand
{
    protected $config;

    /**
     * AppThemeRebuildCommand constructor.
     * @param array $config
     */
    public function __construct($config = [])
    {
        parent::__construct();
        $this->config = $config;
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return void
     * @throws \Exception
     */

    public function execute(InputInterface $input, OutputInterface $output)
    {
        if (!file_exists(BASE_PATH . '/cache/app/engine/')) {
            throw new \RuntimeException(
                "Can't find application engine folder, Please run bin/console app:rebuild"
            );
        }

        $watchCompiler = '';

        $optionValue = $input->getOption('watch');

        if ($optionValue === true) {
            $watchCompiler = '--watch';
        }

        chdir(BASE_PATH . '/cache/app/engine/');

        shell_exec(
            "../../../node_modules/.bin/node-sass $watchCompiler --output-style compressed src/assets/themes/suite8/css/style.scss > src/assets/themes/suite8/css/style.min.css"
        );

        $compiledThemeDir = 'src/assets/themes/*/css/';
        $compiledThemeFile = 'style.min.css';

        $compiledFilesCheck = shell_exec("find $compiledThemeDir -name '$compiledThemeFile' -print");

        if ($compiledFilesCheck === null) {
            throw new \RuntimeException(
                'Compiled theme files have failed to create. Check that the SuiteCRM 8 source theme files exist.'
            );
        }
    }

    protected function configure(): void
    {
        $this
            ->setName('app:theme:rebuild')
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
