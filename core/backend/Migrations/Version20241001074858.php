<?php

declare(strict_types=1);

namespace App\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241001074858 extends AbstractMigration
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
            $entityManager->getConnection()->executeQuery('ALTER TABLE users ADD COLUMN `totp_secret` varchar  NULL');
        } catch (\Exception $e) {
        }

    }

    public function down(Schema $schema): void
    {
    }
}
