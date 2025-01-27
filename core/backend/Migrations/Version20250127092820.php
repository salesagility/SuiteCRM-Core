<?php

declare(strict_types=1);

namespace App\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250127092820 extends BaseMigration implements ContainerAwareInterface
{

    public function getDescription(): string
    {
        return 'Update Log Dir in config.php';
    }

    public function up(Schema $schema): void
    {

        $systemConfigsHandler = $this->container->get('app.system-configs');
        $systemConfigs = $systemConfigsHandler?->getConfigs();

        if ($systemConfigs['log_dir'] === '../../logs/legacy') {
            $this->log('Log Dir already up to date');
            return;
        }

        $logPaths = [
          '.',
          '',
          './'
        ];

        if (in_array($systemConfigs['log_dir'], $logPaths, true)) {
            $systemConfigs['log_dir'] = '../../logs/legacy';
            $systemConfigsHandler?->updateSystemConfig($systemConfigs);
            $this->log('Updated Log Dir in config.php');
            return;
        }

        $this->log('Log Dir already Updated');
    }

    public function down(Schema $schema): void
    {
    }
}
