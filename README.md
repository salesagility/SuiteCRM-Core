<a href="https://suitecrm.com">
  <img width="180px" height="41px" src="https://suitecrm.com/wp-content/uploads/2017/12/logo.png" align="right" />
</a>

# SuiteCRM 8.0-alpha

[SuiteCRM](https://suitecrm.com) is the award-winning open-source, enterprise-ready Customer Relationship Management (CRM) software application.

Our vision is to be the most adopted open source enterprise CRM in the world, giving users full control of their data and freedom to own and customise their business solution.

Try out a free fully working [SuiteCRM demo available here](https://suitecrm.com/demo/)


### License [![AGPLv3](https://img.shields.io/github/license/suitecrm/suitecrm.svg)](./LICENSE.txt)

SuiteCRM is published under the AGPLv3 license.


## Quick Start Quide

### System Requirements

|  Requirement |  Version | |  Database |  Version |
|---|---|---|---|---|
|  PHP | 7.2+ || MariaDB |10.2+ |
|  Angular | 7+ || MySQL | 5.6-5.7|
|  Node.js | 10 || SQL Server | 2012+ |
|  Apache | 2.4 |

### Installation

1. Run `composer install` in the root directory
2. Run `composer install` in legacy directory
3. Compile legacy theme
3. Run legacy install process
4. Create config.yml with config directory with the following strucure
```
server:
  environment: 'develop'
storage:
  mysql:
    driver: 'pdo_mysql'
    host: '{db_host}'
    dbname: '{db_name}'
    user: '{db_user}'
    password: '{db_pass}'
    io: 'both'
entity:
  namespaces:
    core/modules/Users/Config/orm: 'SuiteCRM\Core\Modules\Users\Entity'
```
5. Set permissions
```
chown -R {user ID}:{web user group} .
find . -type d -exec chmod 0755 {} \;
find . -type f -exec chmod 0644 {} \;
chmod +x bin/cli
```
6. Run `bin/cli orm:schema-tool:update --force`
7. Run `bin/cli app:rebuild`