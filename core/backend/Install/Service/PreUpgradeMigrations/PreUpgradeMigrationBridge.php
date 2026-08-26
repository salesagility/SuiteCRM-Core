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

namespace App\Install\Service\PreUpgradeMigrations;

use App\Engine\Model\Feedback;
use Psr\Log\LoggerInterface;
use Symfony\Component\Filesystem\Filesystem;
use Throwable;

class PreUpgradeMigrationBridge implements PreUpgradeMigrationBridgeInterface
{
    public const DESTINATION_RELATIVE = 'core/backend/PreUpgradeMigrations';

    /**
     * @param string $projectDir Bound from %kernel.project_dir%
     * @param string $upgradePackageDir Bound from %packages.upgrade.dir%
     */
    public function __construct(
        private string $projectDir,
        private string $upgradePackageDir,
        private PreUpgradeMigrationRunnerInterface $runner,
        private LoggerInterface $upgradeLogger
    ) {
    }

    public function run(string $version): Feedback
    {
        $sourceDir = $this->upgradePackageDir . '/' . $version . '-extracted/' . self::DESTINATION_RELATIVE;

        if (!is_dir($sourceDir)) {
            $this->upgradeLogger->info(
                'No ' . self::DESTINATION_RELATIVE . ' folder found in extracted package. Skipping pre-upgrade migrations'
            );

            $feedback = new Feedback();
            $feedback->setSuccess(true)->setMessages(['No pre-upgrade migrations in package. Skipping']);

            return $feedback;
        }

        $destinationDir = $this->getDestinationDir();

        $copyFeedback = $this->copyMigrations($sourceDir, $destinationDir);

        if ($copyFeedback !== null) {
            return $copyFeedback;
        }

        $this->upgradeLogger->info(
            'Copied pre-upgrade migrations from package to: ' . $destinationDir
        );

        return $this->runner->run($destinationDir);
    }

    protected function getDestinationDir(): string
    {
        return $this->projectDir . '/' . self::DESTINATION_RELATIVE;
    }

    /**
     * Returns null on success, or a failure Feedback if the copy fails.
     */
    protected function copyMigrations(string $source, string $destination): ?Feedback
    {
        $filesystem = new Filesystem();

        try {
            if (!$filesystem->exists($destination)) {
                $filesystem->mkdir($destination);
            }

            $versionFiles = glob($source . '/Version*.php');

            if ($versionFiles === false) {
                $versionFiles = [];
            }

            foreach ($versionFiles as $file) {
                $filesystem->copy($file, $destination . '/' . basename($file), true);
            }
        } catch (Throwable $e) {
            $this->upgradeLogger->error(
                'Failed to copy pre-upgrade migrations: ' . $e->getMessage()
            );

            $feedback = new Feedback();
            $feedback->setSuccess(false)
                     ->setMessages(['Failed to copy pre-upgrade migrations: ' . $e->getMessage()]);

            return $feedback;
        }

        return null;
    }
}
