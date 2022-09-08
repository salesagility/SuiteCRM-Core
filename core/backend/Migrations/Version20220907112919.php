<?php

declare(strict_types=1);

namespace App\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

final class Version20220907112919 extends AbstractMigration implements ContainerAwareInterface
{
    /**
     * @var ContainerInterface
     */
    protected $container;

    /**
     * @var LoggerInterface
     */
    protected $upgradeLogger;

    public function getDescription(): string
    {
        return 'Add LOCK_DSN to .env';
    }

    public function isTransactional(): bool
    {
        return false;
    }

    public function up(Schema $schema): void
    {
        $envFile = $this->getProjectDir() . "/.env";

        if (!file_exists($envFile)) {
            return;
        }

        $envContents = file_get_contents($envFile);

        if (strpos($envContents, 'LOCK_DSN')) {
            $this->upgradeLogger->info('.env already contains LOCK_DSN. Skipping update.');

            return;
        }

        $envContents .= "\n";
        $envContents .= "###> symfony/lock ###\n";
        $envContents .= "LOCK_DSN=flock\n";
        $envContents .= "###< symfony/lock ###\n";
        $envContents .= "\n";

        file_put_contents($envFile, $envContents);

        $this->log('Added LOCK_DSN to .env.');
    }

    public function down(Schema $schema): void
    {
    }

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

        $logger = $this->container->get('monolog.logger.upgrade');
        if ($logger instanceof LoggerInterface) {
            $this->upgradeLogger = $logger;

            return $logger;
        }

        return null;
    }
}
