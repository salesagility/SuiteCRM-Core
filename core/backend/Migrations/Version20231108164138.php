<?php

declare(strict_types=1);

namespace App\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231108164138  extends BaseMigration implements ContainerAwareInterface
{
    use EnvHandlingMigrationTrait;

    /**
     * @var ContainerInterface
     */
    protected $container;

    /**
     * @var LoggerInterface
     */
    protected $upgradeLogger;

    public function getDescription() : string
    {
        return 'Remove pdf from allowed_preview';
    }

    public function up(Schema $schema) : void
    {
        $systemConfigsHandler = $this->container->get('app.system-configs');
        $systemConfigs = $systemConfigsHandler->getConfigs();
        if (isset($systemConfigs['allowed_preview']) && in_array('pdf', $systemConfigs['allowed_preview'])) {
            $key = array_search('pdf', $systemConfigs['allowed_preview']);
            unset($systemConfigs['allowed_preview'][$key]);
            $systemConfigsHandler->updateSystemConfig($systemConfigs);
            $this->log('Removed PDF from allowed_preview inside config file.');
            return;
        }

        $this->log('PDF was not found in allowed_preview config skipping...');

    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs

    }
}
