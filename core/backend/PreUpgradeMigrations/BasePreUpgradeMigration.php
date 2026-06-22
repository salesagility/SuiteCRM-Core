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

namespace App\PreUpgradeMigrations;

use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Base class for pre-upgrade migration scripts.
 *
 * Files extending this class are shipped inside the upgrade package under the
 * PreUpgradeMigrations folder. During the upgrade-install stage they are copied
 * to core/backend/PreUpgradeMigrations/ and executed once, tracked in the
 * pre_upgrade_migration_versions table.
 *
 * Naming convention: Version<YYYYMMDDHHmmss>.php (e.g. Version20250605120000.php)
 * The class name must match the filename without the .php extension.
 *
 * Services are not injected via the constructor. Use $this->container to access
 * any Symfony service at runtime, identical to the BaseMigration pattern.
 */
abstract class BasePreUpgradeMigration implements ContainerAwareInterface
{
    protected $container;

    protected $upgradeLogger;

    public function setContainer(ContainerInterface $container = null): void
    {
        $this->container = $container;
    }

    protected function getProjectDir(): string
    {
        return $this->container->getParameter('kernel.project_dir');
    }

    protected function log(string $message): void
    {
        $logger = $this->getUpgradeLogger();

        if ($logger === null) {
            return;
        }

        $logger->info($message);
    }

    protected function getUpgradeLogger(): ?LoggerInterface
    {
        if ($this->upgradeLogger !== null) {
            return $this->upgradeLogger;
        }

        if ($this->container === null) {
            return null;
        }

        $logger = $this->container->get('monolog.logger.upgrade');

        if ($logger instanceof LoggerInterface) {
            $this->upgradeLogger = $logger;

            return $logger;
        }

        return null;
    }

    /**
     * Return false to skip execution for this upgrade cycle. The migration will
     * not be marked as executed and will be re-evaluated during the next upgrade.
     */
    abstract public function shouldRun(): bool;

    /**
     * Only called when shouldRun() returns true. On successful completion the
     * migration is recorded in pre_upgrade_migration_versions and will not run
     * again. Throwing an exception aborts the step and leaves the migration
     * untracked, so it can be retried.
     */
    abstract public function execute(): void;
}
