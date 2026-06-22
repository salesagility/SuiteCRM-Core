<?php
/**
 * SuiteCRM is a customer relationship management program developed by SuiteCRM Ltd.
 * Copyright (C) 2026 SuiteCRM Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SUITECRM, SUITECRM DISCLAIMS THE
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

namespace App\Install\Command\PreUpgradeMigrations;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'suitecrm:pre-upgrade-migrations:run-single')]
class RunPreUpgradeMigrationCommand extends BasePreUpgradeMigrationCommand
{
    protected function configure(): void
    {
        $this->setDescription('Run a single pre-upgrade migration by version name')
             ->addArgument('version', InputArgument::REQUIRED, 'The version name (e.g. Version20250605120000)')
             ->addOption('force', 'f', InputOption::VALUE_NONE, 'Re-run even if already executed');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $version = $input->getArgument('version');
        $force = $input->getOption('force');

        $feedback = $this->runner->runSingle($this->getMigrationsDir(), $version, $force);

        return $this->writeFeedback($output, $feedback);
    }
}
