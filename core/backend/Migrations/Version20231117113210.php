<?php

declare(strict_types=1);

namespace App\Migrations;

use CacheManager;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231117113210 extends BaseMigration
{

    /**
     * @var CacheManager
     */
    protected $cacheManager;

    public function getDescription() : string
    {
        return "Create cache_rebuild table if the table doesn't exist";
    }

    public function up(Schema $schema) : void
    {
        $tableExists = $this->cacheManager->checkIfCacheTableExists();

        if ($tableExists){
            $this->log('Cache Table Exists');
            return;
        }

        $this->log('Could not create cache table');
    }

    public function down(Schema $schema) : void
    {
    }
}
