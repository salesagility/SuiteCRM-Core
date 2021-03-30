<?php

namespace SuiteCRM\Core\Modules\Administration\Cli\Repair;

use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

use SuiteCRM\Core\Base\Cli\SuiteCommand;

/**
 * Class QuickRepairRebuildCommand
 * @package SuiteCRM\Core\Modules\Administration\Cli\Repair
 */
class QuickRepairRebuildCommand extends SuiteCommand
{
    // The name of the command
    protected function configure()
    {
        $this
            ->setName('admin:repair:quick-repair-rebuild')
            ->setDescription('Run Quick Repair and Rebuild')
            ->setHelp('This command allows you to run the repair and rebuild.');
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int|void|null
     */
    public function execute(InputInterface $input, OutputInterface $output)
    {
    }
}
