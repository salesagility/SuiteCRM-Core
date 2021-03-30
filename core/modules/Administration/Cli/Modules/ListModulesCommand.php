<?php

namespace SuiteCRM\Core\Modules\Administration\Cli\Modules;

use \SuiteCRM\Core\Base\Module\Manager as ModuleManager;
use \SuiteCRM\Core\Base\Config\Manager as ConfigManager;
use \SuiteCRM\Core\Base\Helper\File\File;
use \SuiteCRM\Core\Base\Cli\SuiteCommand;

use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

/**
 * Class ListModulesCommand
 * @package SuiteCRM\Core\Modules\Administration\Cli\Modules
 */
class ListModulesCommand extends SuiteCommand
{
    protected function configure()
    {
        $this
            ->setName('core:modules:list-all')
            ->setDescription('List Application Modules')
            ->setHelp('This command will list the possible Application Modules.');
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int|void|null
     * @throws \Exception
     */
    public function execute(InputInterface $input, OutputInterface $output)
    {
        $io = new SymfonyStyle($input, $output);

        $io->success('List of all modules.');

        $parameterCollection = (new ConfigManager())->loadFiles(
            [
                BASE_PATH . '/core/base/Config/modules.config.yml'
            ]
        );

        $fileHelper = new File();

        $modules = (new ModuleManager($parameterCollection, $fileHelper))->listEnabled();

        $tableHeaders = [
            ['Module Name', 'Module Description']
        ];

        for ($i = 0, $iMax = count($modules); $i < $iMax; $i++) {
            $moduleData[$i] = [
                $modules[$i]->getName(),
                $modules[$i]->getDescription()
            ];
        }

        $io->table($tableHeaders, $moduleData);
    }
}
