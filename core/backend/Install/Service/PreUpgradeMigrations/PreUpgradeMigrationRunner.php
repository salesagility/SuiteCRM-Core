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
use App\PreUpgradeMigrations\BasePreUpgradeMigration;
use App\Data\LegacyHandler\PreparedStatementHandler;
use DateTimeImmutable;
use Doctrine\DBAL\Connection;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Throwable;

class PreUpgradeMigrationRunner implements PreUpgradeMigrationRunnerInterface
{
    private const TABLE = 'pre_upgrade_migration_versions';
    private const MIGRATION_NAMESPACE = 'App\\PreUpgradeMigrations\\';

    /**
     * @param ContainerInterface $container Injected to pass into each migration instance.
     */
    public function __construct(
        private ContainerInterface $container,
        private Connection $connection,
        private PreparedStatementHandler $preparedStatementHandler,
        private LoggerInterface $upgradeLogger
    ) {
    }

    public function run(string $migrationsDir): Feedback
    {
        $feedback = new Feedback();

        $this->ensureTableExists();

        $files = $this->discoverFiles($migrationsDir);

        if (empty($files)) {
            $feedback->setSuccess(true)->setMessages(['No pre-upgrade migrations found. Skipping']);

            return $feedback;
        }

        $executed = [];

        foreach ($files as $file) {
            $outcome = $this->runFile($file);

            if ($outcome === true) {
                $executed[] = basename($file);
            } elseif ($outcome === false) {
                $feedback->setSuccess(false)
                         ->setMessages(['Pre-upgrade migration failed: ' . basename($file)]);

                return $feedback;
            }
        }

        $feedback->setSuccess(true);

        if (empty($executed)) {
            $feedback->setMessages(['No new pre-upgrade migrations to run']);
        } else {
            $feedback->setMessages(['Successfully ran pre-upgrade migration(s): ' . implode(', ', $executed)]);
        }

        return $feedback;
    }

    public function runSingle(string $migrationsDir, string $version, bool $force = false): Feedback
    {
        $feedback = new Feedback();

        $this->ensureTableExists();

        $file = $migrationsDir . '/' . $version . '.php';

        if (!file_exists($file)) {
            $feedback->setSuccess(false)
                     ->setMessages(['Pre-upgrade migration file not found: ' . $file]);

            return $feedback;
        }

        $instance = $this->loadInstance($file);

        if ($instance === null) {
            $feedback->setSuccess(false)
                     ->setMessages(['Could not load pre-upgrade migration: ' . $version]);

            return $feedback;
        }

        $className = $this->toClassName($version);

        if (!$force && $this->hasExecuted($className)) {
            $feedback->setSuccess(true)
                     ->setMessages(['Pre-upgrade migration already executed: ' . $version]);

            return $feedback;
        }

        if ($force && $this->hasExecuted($className)) {
            $this->clearExecuted($className);
        }

        $instance->setContainer($this->container);

        if (!$instance->shouldRun()) {
            $this->upgradeLogger->info('Pre-upgrade migration skipped by shouldRun(): ' . $className);

            $feedback->setSuccess(true)
                     ->setMessages(['Pre-upgrade migration skipped by shouldRun(): ' . $version]);

            return $feedback;
        }

        $error = $this->executeMigration($instance, $className);

        if ($error !== null) {
            $feedback->setSuccess(false)
                     ->setMessages(['Pre-upgrade migration failed: ' . $version . ' — ' . $error]);

            return $feedback;
        }

        $feedback->setSuccess(true)
                 ->setMessages(['Successfully ran pre-upgrade migration: ' . $version]);

        return $feedback;
    }

    public function getStatus(string $migrationsDir): array
    {
        $this->ensureTableExists();

        $files = $this->discoverFiles($migrationsDir);
        $status = [];

        foreach ($files as $file) {
            $shortVersion = $this->getVersionName($file);
            $className = $this->toClassName($shortVersion);
            $executedAt = $this->getExecutedAt($className);

            $instance = $this->loadInstance($file);
            $description = '';

            if ($instance !== null) {
                $description = $instance->getDescription();
            }

            $status[] = [
                'version' => $shortVersion,
                'description' => $description,
                'executed' => $executedAt !== null,
                'executed_at' => $executedAt,
            ];
        }

        return $status;
    }

    /**
     * @return bool|null true = executed, false = failed, null = skipped
     */
    protected function runFile(string $file): ?bool
    {
        $instance = $this->loadInstance($file);

        if ($instance === null) {
            return null;
        }

        $className = $this->toClassName($this->getVersionName($file));

        if ($this->hasExecuted($className)) {
            return null;
        }

        $instance->setContainer($this->container);

        if (!$instance->shouldRun()) {
            $this->upgradeLogger->info('Pre-upgrade migration skipped by shouldRun(): ' . $className);

            return null;
        }

        return $this->executeMigration($instance, $className) === null;
    }

    /**
     * @return string|null null on success, error message on failure
     */
    protected function executeMigration(BasePreUpgradeMigration $instance, string $className): ?string
    {
        try {
            $this->upgradeLogger->info('Running pre-upgrade migration: ' . $className);

            $instance->execute();

            $this->markExecuted($className);

            $this->upgradeLogger->info('Pre-upgrade migration completed: ' . $className);

            return null;
        } catch (Throwable $e) {
            $this->upgradeLogger->error(
                'Pre-upgrade migration failed: ' . $className . ' — ' . $e->getMessage()
            );

            return $e->getMessage();
        }
    }

    protected function loadInstance(string $file): ?BasePreUpgradeMigration
    {
        require_once $file;

        $className = $this->toClassName($this->getVersionName($file));

        if (!class_exists($className)) {
            $this->upgradeLogger->warning(
                'Pre-upgrade migration class not found in file, skipping: ' . $file
            );

            return null;
        }

        $instance = new $className();

        if (!$instance instanceof BasePreUpgradeMigration) {
            $this->upgradeLogger->warning(
                'Pre-upgrade migration class does not extend BasePreUpgradeMigration, skipping: ' . $className
            );

            return null;
        }

        return $instance;
    }

    protected function toClassName(string $shortVersion): string
    {
        return self::MIGRATION_NAMESPACE . $shortVersion;
    }

    protected function getVersionName(string $file): string
    {
        return pathinfo($file, PATHINFO_FILENAME);
    }

    /**
     * @return string[]
     */
    protected function discoverFiles(string $dir): array
    {
        if (!is_dir($dir)) {
            return [];
        }

        $files = glob($dir . '/Version*.php');

        if ($files === false) {
            return [];
        }

        sort($files);

        return $files;
    }

    protected function ensureTableExists(): void
    {
        try {
            $this->connection->executeStatement(
                'CREATE TABLE IF NOT EXISTS ' . self::TABLE . ' (
                    version VARCHAR(191) NOT NULL,
                    executed_at DATETIME NOT NULL,
                    PRIMARY KEY (version)
                )'
            );
        } catch (Throwable $e) {
            $this->upgradeLogger->error(
                'Failed to create pre-upgrade migration tracking table: ' . $e->getMessage()
            );

            throw $e;
        }
    }

    protected function hasExecuted(string $version): bool
    {
        return $this->getExecutedAt($version) !== null;
    }

    protected function getExecutedAt(string $version): ?string
    {
        $queryBuilder = $this->preparedStatementHandler->createQueryBuilder();
        $queryBuilder->select('executed_at')
                     ->from(self::TABLE)
                     ->where('version = :version')
                     ->setParameter('version', $version);

        $result = $queryBuilder->executeQuery()->fetchAssociative();

        if ($result === false) {
            return null;
        }

        return $result['executed_at'] ?? null;
    }

    protected function markExecuted(string $version): void
    {
        $queryBuilder = $this->preparedStatementHandler->createQueryBuilder();
        $queryBuilder->insert(self::TABLE)
                     ->setValue('version', ':version')
                     ->setValue('executed_at', ':executed_at')
                     ->setParameter('version', $version)
                     ->setParameter('executed_at', (new DateTimeImmutable())->format('Y-m-d H:i:s'));

        $queryBuilder->executeStatement();
    }

    protected function clearExecuted(string $version): void
    {
        $queryBuilder = $this->preparedStatementHandler->createQueryBuilder();
        $queryBuilder->delete(self::TABLE)
                     ->where('version = :version')
                     ->setParameter('version', $version);

        $queryBuilder->executeStatement();
    }
}
