<?php

namespace SuiteCRM\Core\Modules\Administration\Cli\Users;

use SuiteCRM\Core\Base\Cli\SuiteCommand;

use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Class AddNewUserCommand
 * @package SuiteCRM\Core\Modules\Administration\Cli\Users
 */
class AddNewUserCommand extends SuiteCommand
{
    // The name of the command
    protected function configure()
    {
        $this
            ->setName('admin:add-new-user')
            ->setDescription('Add new user to the system')
            ->setHelp('This command allows you to run the add new user to the system.');
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int|void
     */
    public function execute(InputInterface $input, OutputInterface $output)
    {
        /**
         * @todo : Create input for user before creating
         */
    }
}
