<?php

declare(strict_types=1);

namespace App\Migrations;

use Doctrine\DBAL\DBALException;
use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200608135040 extends AbstractMigration
{
    /**
     * @return string
     */
    public function getDescription(): string
    {
        return '';
    }

    /**
     * @param Schema $schema
     * @throws DBALException
     */
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql',
            'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE users (id CHAR(36) CHARACTER SET utf8 DEFAULT \'None\' NOT NULL COLLATE `utf8_general_ci`, user_name VARCHAR(60) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, user_hash VARCHAR(255) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, system_generated_password TINYINT(1) DEFAULT NULL, pwd_last_changed DATETIME DEFAULT NULL, authenticate_id VARCHAR(100) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, sugar_login TINYINT(1) DEFAULT \'1\', first_name VARCHAR(255) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, last_name VARCHAR(255) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, is_admin TINYINT(1) DEFAULT \'0\', external_auth_only TINYINT(1) DEFAULT \'0\', receive_notifications TINYINT(1) DEFAULT \'1\', description TEXT CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, date_entered DATETIME DEFAULT NULL, date_modified DATETIME DEFAULT NULL, modified_user_id CHAR(36) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, created_by CHAR(36) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, title VARCHAR(50) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, photo VARCHAR(255) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, department VARCHAR(50) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, phone_home VARCHAR(50) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, phone_mobile VARCHAR(50) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, phone_work VARCHAR(50) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, phone_other VARCHAR(50) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, phone_fax VARCHAR(50) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, status VARCHAR(100) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, address_street VARCHAR(150) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, address_city VARCHAR(100) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, address_state VARCHAR(100) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, address_country VARCHAR(100) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, address_postalcode VARCHAR(20) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, deleted TINYINT(1) DEFAULT NULL, portal_only TINYINT(1) DEFAULT \'0\', show_on_employees TINYINT(1) DEFAULT \'1\', employee_status VARCHAR(100) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, messenger_id VARCHAR(100) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, messenger_type VARCHAR(100) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, reports_to_id CHAR(36) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, is_group TINYINT(1) DEFAULT NULL, factor_auth TINYINT(1) DEFAULT NULL, factor_auth_interface VARCHAR(255) CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_general_ci`, INDEX idx_user_name (user_name, is_group, status, last_name(30), first_name(30), id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB COMMENT = \'\' ');
    }

    /**
     * @param Schema $schema
     * @throws DBALException
     */
    public function down(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql',
            'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE users');
    }
}
