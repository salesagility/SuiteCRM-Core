<?php

declare(strict_types=1);

namespace App\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241001074858 extends BaseMigration implements ContainerAwareInterface
{
    public function getDescription(): string
    {
        return 'Add Totp Secret Field to DB';
    }

    public function up(Schema $schema): void
    {
        /** @var EntityManagerInterface $entityManager */
        $entityManager = $this->container->get('entity_manager');

        try {
            $entityManager->getConnection()->executeQuery('ALTER TABLE users ADD COLUMN `totp_secret` varchar(255) NULL');
        } catch (\Exception $e) {
            $this->log('Failed to add column totp_secret to users. Error: ' . $e->getMessage());
        }

        try {
            $entityManager->getConnection()->executeQuery('ALTER TABLE users ADD COLUMN `is_totp_enabled` tinyint(1) NULL');
        } catch (\Exception $e) {
            $this->log('Failed to add column is_totp_enabled to users. Error: ' . $e->getMessage());
        }

        try {
            $entityManager->getConnection()->executeQuery('ALTER TABLE users ADD COLUMN `backup_codes` text NULL');
        } catch (\Exception $e) {
            $this->log('Failed to add column $backupCodes to users. Error: ' . $e->getMessage());
        }

    }

    public function down(Schema $schema): void
    {
    }
}
