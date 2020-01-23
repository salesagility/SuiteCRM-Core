<a href="https://suitecrm.com">
  <img width="180px" height="41px" src="https://suitecrm.com/wp-content/uploads/2017/12/logo.png" align="right" />
</a>

# SuiteCRM 8.0-alpha

[SuiteCRM](https://suitecrm.com) is the award-winning open-source, enterprise-ready Customer Relationship Management (CRM) software application.

Our vision is to be the most adopted open source enterprise CRM in the world, giving users full control of their data and freedom to own and customise their business solution.

Try out a free fully working [SuiteCRM demo available here](https://suitecrm.com/demo/)

### License [![AGPLv3](https://img.shields.io/github/license/suitecrm/suitecrm.svg)](./LICENSE.txt)

SuiteCRM is published under the AGPLv3 license.

## Quick Start Guide

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
```
./vendor/bin/pscss -f compressed themes/SuiteP/css/Dawn/style.scss > themes/SuiteP/css/Dawn/style.css
./vendor/bin/pscss -f compressed themes/SuiteP/css/Day/style.scss > themes/SuiteP/css/Day/style.css
./vendor/bin/pscss -f compressed themes/SuiteP/css/Dusk/style.scss > themes/SuiteP/css/Dusk/style.css
./vendor/bin/pscss -f compressed themes/SuiteP/css/Night/style.scss > themes/SuiteP/css/Night/style.css
```
3. Run legacy install process
4. Set permissions
```
chown -R {user ID}:{web user group} .
find . -type d -exec chmod 0755 {} \;
find . -type f -exec chmod 0644 {} \;
chmod +x bin/console
```
5. Run `bin/console orm:schema-tool:update --force`
6. Run `npm install`
7. Run `ng build`