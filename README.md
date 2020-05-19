[![SuiteCRM Logo](https://suitecrm.com/wp-content/uploads/2017/12/logo.png)](https://suitecrm.com)

# SuiteCRM 8.0-alpha

[SuiteCRM](https://suitecrm.com) is the award-winning open-source, enterprise-ready Customer Relationship Management (CRM) software application.

Our vision is to be the most adopted open source enterprise CRM in the world, giving users full control of their data and freedom to own and customise their business solution.

Try out a free fully working [SuiteCRM demo available here](https://suitecrm.com/demo/)

### License [![AGPLv3](https://img.shields.io/github/license/suitecrm/suitecrm.svg)](./legacy/LICENSE.txt)

SuiteCRM is published under the AGPLv3 license.

## Quick Start Guide

### System Requirements

|  Requirement |  Version | |  Database |  Version |
|---|---|---|---|---|
|  PHP | 7.2+ | | MariaDB |10.2+ |
|  Angular | 7+ | | MySQL | 5.6-5.7|
|  Node.js | 10 | | SQL Server | 2012+ |
|  Apache | 2.4 |

### Installation

1: Run `composer install` in the root directory <br/>
2: Run `composer install` in legacy directory <br/>
3: Run legacy theme compile in legacy directory <br/>
```
./vendor/bin/pscss -f compressed themes/suite8/css/Dawn/style.scss > themes/suite8/css/Dawn/style.css
```
4: Set permissions <br/>
```
chown -R {user ID}:{web user group} .
find . -type d -exec chmod 0755 {} \;
find . -type f -exec chmod 0644 {} \;
chmod +x bin/console
``` 
5: Run legacy install process <br/>
6: Go back to root folder <br/>
7: Run `composer dump-env dev` <br/>
8: Set the place-holders in `.env.local.php` to valid credentials <br/>
```
'DATABASE_URL' => 'mysql://user:pass@db_host:db_port/db_name?serverVersion=db_version',
```

9: Run `bin/console doctrine:fixtures:load --append` <br/>
10: Setup proxy config for `ng serve` <br/>
* Copy `proxy.conf.env.json` to `proxy.conf.local.json` <br/>
* Replace `"target": "http//<api_host>:<api_port>"` with your api url <br/>

11: Run `ng build` or `ng serve` <br/>
12: Re-set permissions <br/>
```
chown -R {user ID}:{web user group} .
find . -type d -exec chmod 0755 {} \;
find . -type f -exec chmod 0644 {} \;
chmod +x bin/console
```
